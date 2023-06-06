import { FilterQuery } from 'mongoose';
import { ICuisine } from '../interfaces/cuisine.interface';
import { Cuisine } from '../models/cuisine.model';
import {
    AddCuisineRequestDTO,
    ChangeCuisineRequestDTO,
} from '../dtos/cuisine.dto';
import { Restaurant } from '../models/restaurant.model';

export class CuisineService {
    private filterCuisine = async (
        query: FilterQuery<ICuisine>
    ): Promise<ICuisine> => {
        return await Cuisine.findOne(query);
    };

    private getRestaurantManagerID = async (id: string): Promise<string> => {
        return (await Restaurant.findById(id)).userID.toString();
    };

    public addCuisine = async (
        userID: string,
        restaurantID: string,
        cuisine: AddCuisineRequestDTO
    ) => {
        const managerID = await this.getRestaurantManagerID(restaurantID);
        if (userID !== managerID) {
            throw new Error('Unauthorized Action!');
        }

        const newCuisine = new Cuisine(cuisine);
        newCuisine.restaurantID = restaurantID;
        return await newCuisine.save();
    };

    public getAllCuisines = async (
        restaurantID: string
    ): Promise<ICuisine[]> => {
        return await Cuisine.find({
            restaurantID: restaurantID,
            isActive: true,
        }).exec();
    };

    public getCuisineDetails = async (id: string): Promise<ICuisine> => {
        const cuisine = await this.filterCuisine({ _id: id });
        return cuisine;
    };

    public updateCuisineDetails = async (
        id: string,
        userID: string,
        data: ChangeCuisineRequestDTO
    ): Promise<ICuisine> => {
        const cuisine = await this.filterCuisine({ _id: id });
        if (!cuisine) {
            throw new Error("Cuisine with this ID doesn't exist!");
        }

        const managerID = await this.getRestaurantManagerID(
            cuisine.restaurantID.toString()
        );

        if (userID !== managerID) {
            throw new Error('Unauthorized Action!');
        }

        const updatedCuisine = await Cuisine.findByIdAndUpdate(
            cuisine._id,
            data,
            { new: true }
        ).exec();
        return updatedCuisine;
    };

    public deleteCuisine = async (
        id: string,
        userID: string
    ): Promise<ICuisine> => {
        const cuisine = await this.filterCuisine({ _id: id });
        if (!cuisine) {
            throw new Error("Cuisine with this ID doesn't exist!");
        }

        const managerID = await this.getRestaurantManagerID(
            cuisine.restaurantID.toString()
        );

        if (userID !== managerID) {
            throw new Error('Unauthorized Action!');
        }

        return await cuisine.deleteOne({ new: true });
    };
}
