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
import { GofoodController, GofoodService } from '@modulith-node/modules/gofood';

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

        const userService = new UserService();
        const cuisineService = new CuisineService();
        const restaurantService = new RestaurantService();
        const gofoodService = new GofoodService(
            userService,
            cuisineService,
            restaurantService
        );

        const authController = new AuthController(userService);
        const userController = new UserController(userService);
        const restaurantController = new RestaurantController(
            restaurantService,
            cuisineService
        );
        const gofoodController = new GofoodController(gofoodService);

        this.app.use('/api', root);
        root.use('/auth', authController.router);

        root.use(auth);
        root.use('/users', userController.router);
        root.use('/restaurants', restaurantController.router);
        root.use('/gofood', gofoodController.router);

        this.app.all('*', (_, res) => {
            res.status(400).json({ data: null, message: 'Invalid endpoint!' });
        });
    }

    private setDatabaseConfig() {
        MongoHelper.init();
    }
}

export default new App().app;
