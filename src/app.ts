import bodyParser from 'body-parser';
import express, { Application, Router } from 'express';
import cors from 'cors';
import { MongoHelper } from '@modulith-node/databases/mongo';
import {
    AuthController,
    UserController,
    UserService,
} from '@modulith-node/modules/user';
import { auth } from '@modulith-node/middlewares/auth';
import {
    CuisineService,
    RestaurantController,
    RestaurantService,
} from '@modulith-node/modules/restaurant';

class App {
    public app: Application;

    constructor() {
        this.app = express();

        this.setConfig();
        this.setControllers();
        this.setDatabaseConfig();
    }

    private setConfig() {
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(cors());
    }

    private setControllers() {
        const root = Router();

        const authController = new AuthController(new UserService());
        const userController = new UserController(new UserService());
        const restaurantController = new RestaurantController(
            new RestaurantService(),
            new CuisineService()
        );

        this.app.use('/api', root);
        root.use('/auth', authController.router);

        root.use(auth);
        root.use('/users', userController.router);
        root.use('/restaurants', restaurantController.router);

        this.app.all('*', (_, res) => {
            res.status(400).json({ data: null, message: 'Invalid endpoint!' });
        });
    }

    private setDatabaseConfig() {
        MongoHelper.init();
    }
}

export default new App().app;
