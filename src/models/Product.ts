import mongoose, { Schema, model, Types } from 'mongoose';


export interface INewProduct {
  _id: Types.ObjectId;
  name: string;
  description: string;
  category: string;
  price: number;
}

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  category: string;
  price: number;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, maxlength: 70 },
  description: { type: String, required: true, maxlength: 256 },
  category: { type: String, required: true },
  price: { type: Number, required: true },
});

export const Product = model<IProduct>('Product', productSchema);