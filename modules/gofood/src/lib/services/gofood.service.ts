import { UserService } from '@modulith-node/modules/user';
import { OrderRequestDTO } from '../dtos/gofood.dto';
import {
    CuisineService,
    RestaurantService,
} from '@modulith-node/modules/restaurant';
import { Gofood } from '../models/gofood.model';
import { IGofood } from '../interfaces/gofood.interface';
import { OrderStatus } from '../types/order-status.enum';
import { OrderAction } from '../types/order-action.enum';

export class GofoodService {
    private userService: UserService;
    private cuisineService: CuisineService;
    private restaurantService: RestaurantService;

    constructor(
        userService: UserService,
        cuisineService: CuisineService,
        restaurantService: RestaurantService
    ) {
        this.userService = userService;
        this.cuisineService = cuisineService;
        this.restaurantService = restaurantService;
    }

    private getOrder = async (id: string): Promise<IGofood> => {
        return await Gofood.findOne({ _id: id }).exec();
    };

    private mapActionToStatus = (action: OrderAction) => {
        if (action === OrderAction.Cancel) return OrderStatus.Cancelled;
        else return OrderStatus.Finished;
    };

    private changeOrderStatus = async (
        order: IGofood,
        status: OrderStatus
    ): Promise<IGofood> => {
        order.status = status;
        return await order.save();
    };

    public order = async (
        userID: string,
        orderData: OrderRequestDTO
    ): Promise<IGofood> => {
        const user = await this.userService.getOne(userID);
        if (!user) {
            throw new Error("User with this ID doesn't exist!");
        }

        const restaurant = await this.restaurantService.getRestaurantDetails(
            orderData.restaurantID
        );
        if (!restaurant || !restaurant.isActive) {
            throw new Error("Restaurant is not active or doesn't exist!");
        }

        const totalPrice = await this.cuisineService.validateAndCalculate(
            orderData.cuisinesID
        );
        if (totalPrice < 0) {
            throw new Error('Some menus are not available!');
        }

        const newOrder = new Gofood(orderData);
        newOrder.userID = userID;
        newOrder.totalPrice = totalPrice;

        return await newOrder.save();
    };

    public updateOrder = async (
        orderID: string,
        userID: string,
        action: OrderAction
    ): Promise<IGofood> => {
        const user = await this.userService.getOne(userID);
        if (!user) {
            throw new Error("User with this ID doesn't exist!");
        }

        const order = await this.getOrder(orderID);
        if (!order || order.status !== OrderStatus.Ongoing) {
            throw new Error('No ongoing order with this ID exists!');
        }

        const restaurant = await this.restaurantService.getRestaurantDetails(
            order.restaurantID
        );
        if (!restaurant) {
            throw new Error(
                'Provided restaurant ID is not the same with the order!'
            );
        }

        const isFinishAction = action === OrderAction.Finish;
        const validFinishUser = [order.userID.toString()];
        const validCancelUser = [
            order.userID.toString(),
            restaurant.userID.toString(),
        ];
        if (
            (isFinishAction && !validFinishUser.includes(userID)) ||
            (!isFinishAction && !validCancelUser.includes(userID))
        ) {
            throw new Error('Unauthorized action!');
        }

        if (isFinishAction) {
            if (!(await this.cuisineService.applyOrder(order.cuisinesID))) {
                throw new Error(
                    'Something is wrong when updating cuisine inventories!'
                );
            }
        }

        const finalStatus = this.mapActionToStatus(action);
        return await this.changeOrderStatus(order, finalStatus);
    };

    public getOrderDetails = async (
        orderID: string,
        userID: string
    ): Promise<IGofood> => {
        const order = await this.getOrder(orderID);
        if (!order) {
            throw new Error("Order with this ID doesn't exist!");
        }

        const user = await this.userService.getOne(userID);
        if (!user) {
            throw new Error("User with this ID doesn't exist!");
        }

        const restaurant = await this.restaurantService.getRestaurantDetails(
            order.restaurantID.toString()
        );

        const validUser = [
            order.userID.toString(),
            restaurant.userID.toString(),
        ];
        if (!validUser.includes(userID)) {
            throw new Error('Unauthorized action!');
        }

        return order;
    };
}
