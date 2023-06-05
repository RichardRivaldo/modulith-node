import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from './interfaces/auth.interface';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({
                status: 401,
                message: 'Access Token not found!',
                data: null,
            });
        }

        const creds = jwt.verify(token, process.env.JWT_SECRET_KEY);
        (req as AuthRequest).creds = creds;

        return next();
    } catch (err) {
        return res.status(500).send({
            status: 500,
            message: `Server error when trying to authenticate! Reason: ${err.message}`,
            data: null,
        });
    }
};
