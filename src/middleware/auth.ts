import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Unauthorized } from '../error/errors';
import { IUser } from '../models/User';
import { User } from '../models/User'; // Імпорт моделі з MongoDB

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// Middleware для аутентифікації
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new Unauthorized('Token is required');
    }

    jwt.verify(token, SECRET_KEY, (err, decoded: any) => {
        if (err) {
            throw new Unauthorized('Invalid token');
        }

        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    });
};

// Middleware для авторизації адміністратора
export const authorizeAdmin = (requiredRole: IUser['role']) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.role !== requiredRole) {
            throw new Unauthorized(`${requiredRole} access is required`);
        }
        next();
    };
};
