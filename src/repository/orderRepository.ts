import { Order, IOrder } from '../models/Order';

export class OrderRepository {
  // Отримати замовлення за ID користувача
  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return Order.find({ userId }).populate('products').exec();
  }

  // Створити нове замовлення
  async createOrder(userId: string, productIds: string[]): Promise<IOrder> {
    const newOrder = new Order({
      userId,
      products: productIds,
      status: 'created',
    });
    return newOrder.save();
  }
}
