import { Schema, model } from 'mongoose';
import { IGofood } from '../interfaces/gofood.interface';

const gofoodSchema: Schema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
        },
        userID: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'users',
        },
        restaurantID: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'restaurants',
        },
        cuisinesID: [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'cuisines',
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: 'ONGOING',
            enum: ['ONGOING', 'CANCELLED', 'FINISHED'],
            required: true,
        },
    },
    { timestamps: true }
);

export const Gofood = model<IGofood>('gofood', gofoodSchema);
