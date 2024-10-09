import { Cart, carts, Product } from '../storage/storage';

export class CartRepository {
  getCartByUserId(userId: string): Cart | undefined {
    return carts.find(cart => cart.userId === userId);
  }

  addToCart(userId: string, product: Product): Cart {
    let cart = this.getCartByUserId(userId);

    if (!cart) {
      cart = { id: userId, userId, products: [] };
      carts.push(cart);
    }

    cart.products.push(product);
    return cart;
  }

  clearCart(userId: string) {
    const cartIndex = carts.findIndex(cart => cart.userId === userId);
    if (cartIndex !== -1) {
      carts[cartIndex].products = [];
    }
  }
}
