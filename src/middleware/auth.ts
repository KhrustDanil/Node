import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Unauthorized } from '../error/errors';
import { users } from '../storage/storage';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';  

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

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== 'ADMIN') {
        throw new Unauthorized('Admin access is required');
    }
    next();
};

