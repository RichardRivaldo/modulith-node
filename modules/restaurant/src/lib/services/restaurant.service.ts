import { FilterQuery } from 'mongoose';
import { IRestaurant } from '../interfaces/restaurant.interface';
import { Restaurant } from '../models/restaurant.model';
import {
    AddRestaurantRequestDTO,
    ChangeRestaurantRequestDTO,
} from '../dtos/restaurant.dto';

export class RestaurantService {
    private filterRestaurant = async (
        query: FilterQuery<IRestaurant>
    ): Promise<IRestaurant> => {
        return await Restaurant.findOne(query);
    };

    public addRestaurant = async (
        userID: string,
        restaurant: AddRestaurantRequestDTO
    ): Promise<IRestaurant> => {
        if (await this.filterRestaurant({ name: restaurant.name })) {
            throw new Error('Restaurant name is already taken!');
        }

        const newRestaurant = new Restaurant(restaurant);
        newRestaurant.userID = userID;
        return await newRestaurant.save();
    };

    public getAllRestaurants = async (): Promise<IRestaurant[]> => {
        return await Restaurant.find({ isActive: true }).exec();
    };

    public getRestaurantDetails = async (id: string): Promise<IRestaurant> => {
        const restaurant = await this.filterRestaurant({ _id: id });
        return restaurant;
    };

    public updateRestaurantDetails = async (
        id: string,
        userID: string,
        data: ChangeRestaurantRequestDTO
    ): Promise<IRestaurant> => {
        if (data.name && (await this.filterRestaurant({ name: data.name }))) {
            throw new Error('Restaurant name is already taken!');
        }

        const restaurant = await this.filterRestaurant({ _id: id });
        if (!restaurant) {
            throw new Error("Restaurant with this ID doesn't exist!");
        }

        if (userID !== restaurant.userID.toString()) {
            throw new Error('Unauthorized Action!');
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            restaurant._id,
            data,
            { new: true }
        ).exec();
        return updatedRestaurant;
    };

    public deleteRestaurant = async (
        id: string,
        userID: string
    ): Promise<IRestaurant> => {
        const restaurant = await this.filterRestaurant({ _id: id });
        if (!restaurant) {
            throw new Error("Restaurant with this ID doesn't exist!");
        }

        if (userID !== restaurant.userID.toString()) {
            throw new Error('Unauthorized Action!');
        }

        return await restaurant.deleteOne({ new: true });
    };
}
