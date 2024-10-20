import { Request, Response, NextFunction } from 'express';
import { users } from '../storage/storage';

export const checkUserId = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;
  
    if (!userId) {
      res.status(401).json({ message: 'User ID is required' });
      return;
    }

  const userExists = users.find(user => user.id === userId);

  if (!userExists) {
    res.status(404).json({ error: 'User not found' });
    return; 
  }

  req.userId = userId;
  next();
};
