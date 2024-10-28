import { OrderRepository } from '../repository/orderRepository';
import { CartRepository } from '../repository/cartRepository';
import { NotFound, UnprocessableEntity } from '../error/errors';
import { IOrder } from '../models/Order';

export class OrderService {
  private orderRepository = new OrderRepository();
  private cartRepository = new CartRepository();

  // Отримати замовлення користувача за ID
  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    const orders = await this.orderRepository.getOrdersByUserId(userId);
    
    if (!orders || orders.length === 0) {
      throw new NotFound(`No orders found for user with ID ${userId}`);
    }

    return orders;
  }

  // Створити замовлення
  async createOrder(userId: string): Promise<IOrder> {
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart || cart.products.length === 0) {
      throw new UnprocessableEntity('Cart is empty');
    }
    

    const productIds = cart.products.map(product => {
      if (!product._id) {
        throw new UnprocessableEntity('Product ID is missing.');
      }
      return product._id.toString();
    });

    const order = await this.orderRepository.createOrder(userId, productIds);
    
    await this.cartRepository.clearCart(userId);

    return order;
  }
}
