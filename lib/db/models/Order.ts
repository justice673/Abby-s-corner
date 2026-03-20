import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IOrderItem {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "partial" | "paid";

export type PaymentMethod = "cash" | "mobile_money" | "bank_transfer" | "other";

export interface IOrder extends Document {
  orderRef: string;
  customer: {
    id?: Types.ObjectId;
    name: string;
    phone: string;
    address?: string;
    city?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  source: "whatsapp" | "direct" | "phone" | "other";
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderRef: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      id: { type: Schema.Types.ObjectId, ref: "Customer" },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String },
      city: { type: String },
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: "Order must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "shipped", "delivered", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "mobile_money", "bank_transfer", "other"],
    },
    notes: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ["whatsapp", "direct", "phone", "other"],
      default: "whatsapp",
    },
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ orderRef: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "customer.phone": 1 });

// Generate order reference before saving
OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderRef) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    
    // Count orders for today to generate sequence
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const Order = mongoose.models.Order;
    const todayOrderCount = await Order.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    
    const sequence = String(todayOrderCount + 1).padStart(3, "0");
    this.orderRef = `ABY-${year}${month}${day}-${sequence}`;
  }
  next();
});

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
