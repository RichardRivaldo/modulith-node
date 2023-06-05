import mongoose from 'mongoose';

export class MongoHelper {
    static init() {
        mongoose.Promise = global.Promise;
        mongoose
            .connect(process.env.MONGO_URL as string)
            .then(() => console.log('Successfully connected to the database!'))
            .catch((e: Error) =>
                console.log(`Failed connecting to database, reason ${e}`)
            );
        mongoose.set('toJSON', {
            virtuals: true,
            transform: (_: any, converted: any) => {
                converted.id = converted._id;
                delete converted._id;
                delete converted.__v;
                delete converted.password;
            },
        });
    }

    constructor() {
        return 'MongoHelper created!';
    }
}
