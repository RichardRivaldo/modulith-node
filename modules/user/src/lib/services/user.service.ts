import { FilterQuery } from 'mongoose';
import { ChangeRequestDTO, LoginRequestDTO } from '../dtos/user.dto';
import { IUser } from '../interfaces/user.interface';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {
    private hashPassword = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, 10);
    };

    private checkPassword = async (
        password: string,
        encrypted: string
    ): Promise<boolean> => {
        return await bcrypt.compare(password, encrypted);
    };

    private generateToken = async (
        id: string,
        role: string
    ): Promise<string> => {
        return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d',
        });
    };

    private filterUser = async (query: FilterQuery<IUser>): Promise<IUser> => {
        return await User.findOne(query);
    };

    public register = async (user: IUser): Promise<string> => {
        if (await this.filterUser({ phoneNumber: user.phoneNumber })) {
            throw new Error(
                'Phone number is already used, please login instead!'
            );
        }

        const newUser = new User(user);
        newUser.password = await this.hashPassword(newUser.password);
        await newUser.save();

        return this.generateToken(newUser._id, newUser.role);
    };

    public login = async (creds: LoginRequestDTO): Promise<string> => {
        const user = await this.filterUser({ phoneNumber: creds.phoneNumber });
        if (!user) {
            throw new Error("User with this phone number doesn't exist!");
        }
        if (this.checkPassword(creds.password, user.password)) {
            return this.generateToken(user._id, user.role);
        } else {
            throw new Error('Invalid password!');
        }
    };

    public getOne = async (id: string): Promise<IUser> => {
        const user = await this.filterUser({ _id: id });
        return user;
    };

    public updateOne = async (
        id: string,
        data: ChangeRequestDTO
    ): Promise<IUser> => {
        const user = await this.filterUser({
            _id: id,
        });
        if (!user) {
            throw new Error("User with this ID doesn't exist!");
        }

        if (data.phoneNumber && data.phoneNumber !== user.phoneNumber) {
            const targetUser = await this.filterUser({
                phoneNumber: data.phoneNumber,
            });
            if (targetUser) {
                throw new Error('User with this phone number already exists!');
            }
        }

        if (!(await this.checkPassword(data.currentPassword, user.password))) {
            throw new Error('Invalid password!');
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, data, {
            new: true,
        }).exec();
        return updatedUser;
    };

    public deleteOne = async (id: string): Promise<IUser> => {
        const deletedUser = await User.findByIdAndDelete(id, {
            new: true,
        }).exec();

        if (!deletedUser) {
            throw new Error("User with this ID doesn't exist!");
        }

        return deletedUser;
    };
}
