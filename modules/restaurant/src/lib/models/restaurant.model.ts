import { Schema, model } from 'mongoose';
import { IRestaurant } from '../interfaces/restaurant.interface';

const restaurantSchema: Schema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
        },
        userID: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true,
        },
    },
    { timestamps: true }
);

export const Restaurant = model<IRestaurant>('restaurants', restaurantSchema);
