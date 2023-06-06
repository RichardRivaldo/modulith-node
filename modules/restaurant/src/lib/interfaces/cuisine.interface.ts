import { Document } from 'mongoose';

export interface ICuisine extends Document {
    id: string;
    restaurantID: string;
    name: string;
    price: number;
    totalBought: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
