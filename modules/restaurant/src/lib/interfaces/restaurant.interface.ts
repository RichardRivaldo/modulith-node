import { Document } from 'mongoose';

export interface IRestaurant extends Document {
    id: string;
    userID: string;
    name: string;
    address: string;
    phoneNumber: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
