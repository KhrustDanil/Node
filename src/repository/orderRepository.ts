import { orders, Product, Order } from '../storage/storage';

export class OrderRepository {
  getOrdersByUserId(userId: string): Order[] {
    return orders.filter(order => order.userId === userId);
  }

  createOrder(userId: string, products: Product[]): Order {
    const newOrder = {
      id: Date.now().toString(),
      userId,
      products,
      status: 'created',
    };

    orders.push(newOrder);
    return newOrder;
  }
}
