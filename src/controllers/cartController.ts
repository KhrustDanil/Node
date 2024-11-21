import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';
import { CartService } from '../services/cartService';

const cartService = new CartService();

export const getCart = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const cart = await cartService.getCartByUserId(userId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    res.json({
      user: cart.userId,
      products: cart.products
    });
  } catch (error) {
    next(error);
  }
};
export const addToCart = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const productId = req.body.productId;

    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' });
      return;
    }

    const cart = await cartService.addProductToCart(userId, productId);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    await cartService.clearCart(userId);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    next(error);
  }
};
