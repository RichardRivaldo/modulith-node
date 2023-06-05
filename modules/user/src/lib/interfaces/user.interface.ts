import { Document } from 'mongoose';
import { Role } from '../types/role.enum';

export interface IUser extends Document {
    id: string;
    name: string;
    password: string;
    phoneNumber: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
