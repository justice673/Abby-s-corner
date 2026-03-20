import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHomeCategory {
  label: string;
  href: string;
  area: string;
  image: string;
  subtitle?: string;
  highlightLine?: string;
  bullets?: string[];
  ctaLabel?: string;
}

export interface IHomePerfumeStyle {
  id: string;
  title: string;
  description: string;
  tagline: string;
  cards: {
    label: string;
    title: string;
    content: string;
    items?: string[];
  }[];
  ctaLabel: string;
  ctaLink: string;
}

export interface IHomeArrival {
  name: string;
  description: string;
  price: string;
  image: string;
  link?: string;
}

export interface IHomeBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  image: string;
  comments?: number;
}

export interface IHomeHero {
  title: string;
  highlight: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  videoIntro?: string;
  videoMain?: string;
  backgroundImage?: string;
}

export interface IHomeSection extends Document {
  sectionType:
    | "hero"
    | "categories"
    | "perfume_style"
    | "new_arrivals"
    | "blog"
    | "store"
    | "discount";
  title?: string;
  subtitle?: string;
  isActive: boolean;
  order: number;
  data: IHomeHero | IHomeCategory[] | IHomePerfumeStyle | IHomeArrival[] | IHomeBlogPost[] | Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const HomeSectionSchema = new Schema<IHomeSection>(
  {
    sectionType: {
      type: String,
      required: true,
      enum: [
        "hero",
        "categories",
        "perfume_style",
        "new_arrivals",
        "blog",
        "store",
        "discount",
      ],
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

HomeSectionSchema.index({ sectionType: 1 });
HomeSectionSchema.index({ order: 1 });
HomeSectionSchema.index({ isActive: 1 });

const HomeSection: Model<IHomeSection> =
  mongoose.models.HomeSection ||
  mongoose.model<IHomeSection>("HomeSection", HomeSectionSchema);

export default HomeSection;
