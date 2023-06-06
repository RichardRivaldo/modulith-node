import { Document } from 'mongoose';

export interface IGofood extends Document {
    id: string;
    userID: string;
    restaurantID: string;
    cuisinesID: string[];
    totalPrice: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
