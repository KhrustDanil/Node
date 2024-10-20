import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../error/errors';

export const errorHandler = (error: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error(error.message);
  res.status(error.statusCode || 500).json({ error: error.message });
};