import { CartRepository } from '../repository/cartRepository';
import { ProductRepository } from '../repository/productRepository';
import { NotFound, UnprocessableEntity } from '../error/errors';

export class CartService {
  private cartRepository = new CartRepository();
  private productRepository = new ProductRepository();

  getCartByUserId(userId: string) {
    return this.cartRepository.getCartByUserId(userId);
  }

  addProductToCart(userId: string, productId: string) {
    const product = this.productRepository.getProductById(productId);
    if (!product) {
      throw new NotFound('Product not found');
    }

    const cart = this.cartRepository.addToCart(userId, product);
    return cart;
  }

  clearCart(userId: string) {
    return this.cartRepository.clearCart(userId);
  }
}
