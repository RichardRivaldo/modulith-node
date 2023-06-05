import { Router, Response } from 'express';
import { UserService } from '../services/user.service';
import { Role } from '../types/role.enum';
import { AuthRequest } from '@modulith-node/middlewares/auth';

export class UserController {
    public router: Router = Router();
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        this.setRoutes();
    }

    private setRoutes() {
        this.router.get('/:id', this.getOne);
        this.router.patch('/:id', this.updateOne);
        this.router.delete('/:id', this.deleteOne);
    }

    private getOne = async (req: AuthRequest, res: Response) => {
        try {
            const id = req.params.id;
            if (req.creds['role'] === Role.Admin || req.creds['id'] === id) {
                const result = await this.userService.getOne(id);
                return res.status(200).send({
                    status: 200,
                    message: result
                        ? 'Succesfully got user details!'
                        : 'No user found!',
                    data: result,
                });
            } else {
                return res.status(401).send({
                    status: 401,
                    message: 'Unauthorized action!',
                    data: null,
                });
            }
        } catch (err) {
            return res.status(500).send({
                status: 500,
                message: `Failed getting user details! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private updateOne = async (req: AuthRequest, res: Response) => {
        try {
            const id = req.params.id;
            if (req.creds['role'] === Role.Admin || req.creds['id'] === id) {
                const result = await this.userService.updateOne(id, req.body);
                return res.status(200).send({
                    status: 200,
                    message: 'Succesfully updated user details!',
                    data: result,
                });
            } else {
                return res.status(401).send({
                    status: 401,
                    message: 'Unauthorized action!',
                    data: null,
                });
            }
        } catch (err) {
            return res.status(500).send({
                status: 500,
                message: `Failed updating user details! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private deleteOne = async (req: AuthRequest, res: Response) => {
        try {
            const id = req.params.id;
            if (req.creds['role'] === Role.Admin || req.creds['id'] === id) {
                const result = await this.userService.deleteOne(id);
                return res.status(200).send({
                    status: 200,
                    message: 'Succesfully deleted the user!',
                    data: result,
                });
            } else {
                return res.status(401).send({
                    status: 401,
                    message: 'Unauthorized action!',
                    data: null,
                });
            }
        } catch (err) {
            return res.status(500).send({
                status: 500,
                message: `Failed deleting user! Reason: ${err.message}`,
                data: null,
            });
        }
    };
}
