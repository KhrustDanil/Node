import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export const registerUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    const newUser = userService.registerUser(email, password, name);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const user = userService.getUserById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
