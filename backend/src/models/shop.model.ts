import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview {
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IShop extends Document {
  shop: Types.ObjectId[];
  name: string;
  description: string;
  owner: Types.ObjectId;
  imageUrl: string;
  products: Types.Array<Types.ObjectId>;
  rating: number;
  reviews: Types.Array<IReview>;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const shopSchema = new Schema<IShop>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema]
}, {
  timestamps: true
});

// Calculate average rating when a review is added or modified
shopSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = Number((totalRating / this.reviews.length).toFixed(1));
  }
  next();
});

const Shop = mongoose.model<IShop>('Shop', shopSchema);
export default Shop;
