import { Response, Router } from 'express';
import { RestaurantService } from '../services/restaurant.service';
import { CuisineService } from '../services/cuisine.service';
import { AuthRequest } from '@modulith-node/middlewares/auth';
import { Role } from '@modulith-node/modules/user';

export class RestaurantController {
    public router: Router = Router();
    private cuisineService: CuisineService;
    private restaurantService: RestaurantService;

    constructor(
        restaurantService: RestaurantService,
        cuisineService: CuisineService
    ) {
        this.cuisineService = cuisineService;
        this.restaurantService = restaurantService;
        this.setRoutes();
    }

    private setRoutes() {
        // Restaurant endpoints
        this.router.get('/', this.getAllRestaurants);
        this.router.get('/:id', this.getRestaurantDetails);
        this.router.post('/', this.addRestaurant);
        this.router.patch('/:id', this.updateRestaurantDetails);
        this.router.delete('/:id', this.deleteRestaurant);

        // Cuisine endpoints
        const cuisineRoot = 'cuisines';
        this.router.get(`/:id/${cuisineRoot}/`, this.getAllCuisines);
        this.router.post(`/:id/${cuisineRoot}/`, this.addCuisine);

        this.router.delete(`/${cuisineRoot}/:id`, this.deleteCuisine);
        this.router.get(`/${cuisineRoot}/:id`, this.getCuisineDetails);
        this.router.patch(`/${cuisineRoot}/:id`, this.updateCuisineDetails);
    }

    // Restaurants
    private addRestaurant = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id'] && req.creds['role'] === Role.Merchant) {
                const result = await this.restaurantService.addRestaurant(
                    req.creds['id'],
                    req.body
                );
                return res.status(201).send({
                    status: 201,
                    message: 'Successfully added a restaurant!',
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
                message: `Failed adding new restaurant! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private getAllRestaurants = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id']) {
                const result = await this.restaurantService.getAllRestaurants();
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully get all restaurants!',
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
                message: `Failed getting the restaurants! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private getRestaurantDetails = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id']) {
                const result =
                    await this.restaurantService.getRestaurantDetails(
                        req.params.id
                    );
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully get restaurant details!',
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
                message: `Failed getting restaurant details! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private updateRestaurantDetails = async (
        req: AuthRequest,
        res: Response
    ) => {
        try {
            if (req.creds['id'] && req.creds['role'] === Role.Merchant) {
                const result =
                    await this.restaurantService.updateRestaurantDetails(
                        req.params.id,
                        req.creds['id'],
                        req.body
                    );
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully updated restaurant details!',
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
                message: `Failed updating restaurant details! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private deleteRestaurant = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id'] && req.creds['role'] === Role.Merchant) {
                const result = await this.restaurantService.deleteRestaurant(
                    req.params.id,
                    req.creds['id']
                );
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully deleted the restaurant!',
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
                message: `Failed deleting the restaurant! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    // Cuisines
    private addCuisine = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id'] && req.creds['role'] === Role.Merchant) {
                const result = await this.cuisineService.addCuisine(
                    req.creds['id'],
                    req.params.id,
                    req.body
                );
                return res.status(201).send({
                    status: 201,
                    message: 'Successfully added a cuisine!',
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
                message: `Failed adding new cuisine! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private getAllCuisines = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id']) {
                const result = await this.cuisineService.getAllCuisines(
                    req.params.id
                );
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully get all cuisines!',
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
                message: `Failed getting the cuisines! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private getCuisineDetails = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id']) {
                const result = await this.cuisineService.getCuisineDetails(
                    req.params.id
                );
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully get cuisine details!',
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
                message: `Failed getting cuisine details! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private updateCuisineDetails = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id'] && req.creds['role'] === Role.Merchant) {
                const result = await this.cuisineService.updateCuisineDetails(
                    req.params.id,
                    req.creds['id'],
                    req.body
                );
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully updated cuisine details!',
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
                message: `Failed updating cuisine details! Reason: ${err.message}`,
                data: null,
            });
        }
    };

    private deleteCuisine = async (req: AuthRequest, res: Response) => {
        try {
            if (req.creds['id'] && req.creds['role'] === Role.Merchant) {
                const result = await this.cuisineService.deleteCuisine(
                    req.params.id,
                    req.creds['id']
                );
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully deleted the cuisine!',
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
                message: `Failed deleting the cuisine! Reason: ${err.message}`,
                data: null,
            });
        }
    };
}
