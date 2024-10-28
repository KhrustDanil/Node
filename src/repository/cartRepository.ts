import { Cart, ICart } from '../models/Cart';
import { Types } from 'mongoose';

export class CartRepository {
  // Отримати корзину користувача за ID
  async getCartByUserId(userId: string): Promise<ICart | null> {
    return Cart.findOne({ userId })
      .populate('products')  // Поповнення продуктів
      .populate('userId')    // Поповнення інформації про користувача
      .exec(); // Поповнення продуктів
  }

  // Додати продукт до корзини
  async addToCart(userId: string, productId: string): Promise<ICart | null> {
    const cart = await this.getCartByUserId(userId);

    // Перетворення productId на ObjectId
    const productObjectId = new Types.ObjectId(productId);

    if (!cart) {
      const newCart = new Cart({ userId, products: [productObjectId] });
      return newCart.save();
    }

    cart.products.push(productObjectId);
    return cart.save();
  }

  // Очистити корзину
  async clearCart(userId: string): Promise<void> {
    await Cart.updateOne({ userId }, { $set: { products: [] } }).exec();
  }
}
