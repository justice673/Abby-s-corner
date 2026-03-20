import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  fullName: string;
  brand: string;
  category: string;
  tags: string[];
  condition: string;
  price: number;
  tete: string;
  coeur: string;
  fond: string;
  volume: string;
  stockLeft: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  description?: string;
  isActive: boolean;
  totalSold: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    condition: {
      type: String,
      default: "New with tag",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    tete: {
      type: String,
      trim: true,
    },
    coeur: {
      type: String,
      trim: true,
    },
    fond: {
      type: String,
      trim: true,
    },
    volume: {
      type: String,
      trim: true,
    },
    stockLeft: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalSold: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: "text", brand: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
