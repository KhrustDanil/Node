import { OrderRepository } from '../repository/orderRepository';
import { CartRepository } from '../repository/cartRepository';
import { NotFound, UnprocessableEntity } from '../error/errors';

export class OrderService {
  private orderRepository = new OrderRepository();
  private cartRepository = new CartRepository();

  getOrdersByUserId(userId: string) {
    return this.orderRepository.getOrdersByUserId(userId);
  }

  createOrder(userId: string) {
    const cart = this.cartRepository.getCartByUserId(userId);
    if (!cart || cart.products.length === 0) {
      throw new UnprocessableEntity('Cart is empty');
    }

    const order = this.orderRepository.createOrder(userId, cart.products);
    this.cartRepository.clearCart(userId);
    return order;
  }
}
