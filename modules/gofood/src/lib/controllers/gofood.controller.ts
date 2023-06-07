import { Response, Router } from 'express';
import { GofoodService } from '../services/gofood.service';
import { AuthRequest } from '@modulith-node/middlewares/auth';
import { Role } from '@modulith-node/modules/user';
import { OrderAction } from '../types/order-action.enum';

export class GofoodController {
    public router: Router = Router();
    private gofoodService: GofoodService;

    constructor(gofoodService: GofoodService) {
        this.gofoodService = gofoodService;
        this.setRouter();
    }

    private setRouter() {
        this.router.post('/', this.order);
        this.router.post('/:id/finish', this.finishOrder);
        this.router.post('/:id/cancel', this.cancelOrder);
        this.router.get('/:id', this.getOrderDetails);
    }

    private order = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id'] && req.creds['role'] === Role.User) {
                const result = await this.gofoodService.order(
                    req.creds['id'],
                    req.body
                );
                return res.status(201).send({
                    status: 201,
                    message: 'Successfully created the order!',
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
                message: `Failed creating new order! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private finishOrder = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id'] && req.creds['role'] === Role.User) {
                const result = await this.gofoodService.updateOrder(
                    req.params.id,
                    req.creds['id'],
                    OrderAction.Finish
                );
                return res.status(201).send({
                    status: 201,
                    message: 'Successfully finished the order!',
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
                message: `Failed finishing the order! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private cancelOrder = async (req: AuthRequest, res: Response) => {
        try {
            const userRole = req.creds['role'];
            if (
                req.creds['id'] &&
                (userRole === Role.User || userRole === Role.Merchant)
            ) {
                const result = await this.gofoodService.updateOrder(
                    req.params.id,
                    req.creds['id'],
                    OrderAction.Cancel
                );
                return res.status(201).send({
                    status: 201,
                    message: 'Successfully cancelled the order!',
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
                message: `Failed cancelling the order! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private getOrderDetails = async (req: AuthRequest, res: Response) => {
        try {
            const userRole = req.creds['role'];
            if (
                req.creds['id'] &&
                (userRole === Role.Merchant || userRole === Role.User)
            ) {
                const result = await this.gofoodService.getOrderDetails(
                    req.params.id,
                    req.creds['id']
                );
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully get order details!',
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
                message: `Failed getting order details! Reason: ${err.message}`,
                data: null,
            });
        }
    };
}
