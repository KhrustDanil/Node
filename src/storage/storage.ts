import productsData from './products.store.json';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Cart {
  id: string;
  userId: string;
  products: Product[];
}

export const products: Product[] = productsData;
export const users: User[] = [];
export const carts: Cart[] = [];
export const orders: any[] = [];