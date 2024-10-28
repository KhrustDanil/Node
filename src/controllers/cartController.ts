import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';
import { CartService } from '../services/cartService';

const cartService = new CartService();

export const getCart = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const cart = cartService.getCartByUserId(userId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  };

export const addToCart = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const productId = req.body.productId;
    const cart = cartService.addProductToCart(userId, productId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    cartService.clearCart(userId);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    next(error);
  }
};