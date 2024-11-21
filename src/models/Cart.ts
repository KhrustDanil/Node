import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProduct } from './Product';

export interface ICart extends Document {
  userId: Types.ObjectId;
  products: Types.DocumentArray<IProduct>;
}

const cartSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
});

export const Cart = mongoose.model<ICart>('Cart', cartSchema);