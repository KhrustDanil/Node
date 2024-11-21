import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService';

const orderService = new OrderService();

export const getOrders = (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const orders = orderService.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  };

export const createOrder = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const order = orderService.createOrder(userId);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};
