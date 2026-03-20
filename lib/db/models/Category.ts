import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  type: "core" | "secondary" | "utility";
  image?: string;
  isActive: boolean;
  showInNav: boolean;
  navOrder: number;
  sortOrder: number;
  // Homepage display settings
  showOnHomepage: boolean;
  homepageArea?: string; // Grid area: a, b, c, d, e, f
  homepageSubtitle?: string;
  homepageHighlight?: string;
  homepageBullets?: string[];
  homepageCta?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["core", "secondary", "utility"],
      default: "core",
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showInNav: {
      type: Boolean,
      default: false,
    },
    navOrder: {
      type: Number,
      default: 0,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    // Homepage display settings
    showOnHomepage: {
      type: Boolean,
      default: false,
    },
    homepageArea: {
      type: String,
      enum: ["a", "b", "c", "d", "e", "f", null],
    },
    homepageSubtitle: {
      type: String,
      trim: true,
    },
    homepageHighlight: {
      type: String,
      trim: true,
    },
    homepageBullets: {
      type: [String],
      default: [],
    },
    homepageCta: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1 });

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
