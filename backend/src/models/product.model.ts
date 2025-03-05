import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  shop: Types.ObjectId;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Remove product reference from shop when product is deleted

productSchema.pre<IProduct>('deleteOne', { document: true }, async function (next) {
  try {
    const product = this as IProduct & { _id: Types.ObjectId }; // Explicitly cast this with _id as ObjectId
    const shop = await mongoose.model('Shop').findById(product.shop);

    if (shop && shop.products) {
      shop.products = shop.products.filter(
        (productId: Types.ObjectId) => productId.toString() !== product._id.toString()
      );
      await shop.save();
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});



const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
