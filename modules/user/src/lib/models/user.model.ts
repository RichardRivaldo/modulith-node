import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';

const userSchema: Schema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'USER',
            enum: ['ADMIN', 'USER', 'MERCHANT'],
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    return next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
    const password = this.get('password');
    if (password) {
        const hashed = await bcrypt.hash(password, 10);
        this.set({ password: hashed });
    }
    return next();
});

export const User = model<IUser>('users', userSchema);
