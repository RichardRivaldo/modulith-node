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
    }

    constructor() {
        return 'MongoHelper created!';
    }
}
