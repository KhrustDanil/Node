import { orders, Product } from '../storage/storage';

export class OrderRepository {
  getOrdersByUserId(userId: string) {
    return orders.filter(order => order.userId === userId);
  }

  createOrder(userId: string, products: Product[]) {
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
