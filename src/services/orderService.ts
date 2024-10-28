import { OrderRepository } from '../repository/orderRepository';
import { CartRepository } from '../repository/cartRepository';
import { NotFound, UnprocessableEntity } from '../error/errors';
import { Order } from '../storage/storage';

export class OrderService {
  private orderRepository = new OrderRepository();
  private cartRepository = new CartRepository();

  getOrdersByUserId(userId: string): Order[] {
    const orders = this.orderRepository.getOrdersByUserId(userId);
    
    if (!orders || orders.length === 0) {
      throw new NotFound(`No orders found for user with ID ${userId}`);
    }

    return orders;
  }

  createOrder(userId: string): Order {
    const cart = this.cartRepository.getCartByUserId(userId);

    if (!cart || cart.products.length === 0) {
      throw new UnprocessableEntity('Cart is empty');
    }

    const order = this.orderRepository.createOrder(userId, cart.products);
    
    this.cartRepository.clearCart(userId);

    return order;
  }
}
