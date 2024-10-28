import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProduct } from './Product';

export interface IOrder extends Document {
  userId: Types.ObjectId;
  products: Types.DocumentArray<IProduct>;
  status: string;
}

const orderSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
  }],
  status: {
    type: String,
    enum: ['created', 'completed', 'cancelled'],
    default: 'created',
  },
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
