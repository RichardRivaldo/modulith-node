import { Schema, model } from 'mongoose';
import { ICuisine } from '../interfaces/cuisine.interface';

const cuisineSchema: Schema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
        },
        restaurantID: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'restaurants',
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        totalBought: {
            type: Number,
            default: 0,
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

export const Cuisine = model<ICuisine>('cuisines', cuisineSchema);
