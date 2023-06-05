import bodyParser from 'body-parser';
import express, { Application, Router } from 'express';
import cors from 'cors';
import { MongoHelper } from '@modulith-node/databases/mongo';

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
        this.app.use('/api', root);

        root.get('/', (req, res) => {
            res.send({ message: 'Hello API' });
        });

        this.app.all('*', (_, res) => {
            res.status(400).json({ data: null, message: 'Invalid endpoint!' });
        });
    }

    private setDatabaseConfig() {
        MongoHelper.init();
    }
}

export default new App().app;
