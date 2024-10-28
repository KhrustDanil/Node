import { CartRepository } from '../repository/cartRepository';
import { ProductRepository } from '../repository/productRepository';
import { NotFound, UnprocessableEntity } from '../error/errors';


export class CartService {
  private cartRepository = new CartRepository();
  private productRepository = new ProductRepository();

  async getCartByUserId(userId: string) {
    return await this.cartRepository.getCartByUserId(userId);
  }

  async addProductToCart(userId: string, productId: string) {
    const product = await this.productRepository.getProductById(productId);
    if (!product) {
      throw new NotFound('Product not found');
    }

    if (!product._id) {
      throw new UnprocessableEntity('Product ID is missing.');
    }

    const cart = await this.cartRepository.addToCart(userId, product._id.toString());
    return cart;
  }

  async clearCart(userId: string) {
    return await this.cartRepository.clearCart(userId);
  }
}
