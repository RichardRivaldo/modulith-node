import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class AuthController {
    public router: Router = Router();
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        this.setRoutes();
    }

    private setRoutes() {
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
    }

    private register = async (req: Request, res: Response) => {
        try {
            const result = await this.userService.register(req.body);
            res.status(201).send({
                status: 201,
                message: 'Successfully registered new user!',
                data: { token: result },
            });
        } catch (err) {
            res.status(500).send({
                status: 500,
                message: `Failed registering new user! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private login = async (req: Request, res: Response) => {
        try {
            const result = await this.userService.login(req.body);
            res.status(200).send({
                status: 200,
                message: 'Successfully logged in!',
                data: { token: result },
            });
        } catch (err) {
            res.status(401).send({
                status: 401,
                message: `Failed logging in! Reason: ${err.message}`,
                data: null,
            });
        }
    };
}
