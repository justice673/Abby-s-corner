import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";
import Customer from "@/lib/db/models/Customer";

type OrderItemInput = {
  productId?: string;
  productName?: string;
  brand?: string;
  category?: string;
  quantity?: number;
  unitPrice?: number;
};

// GET all orders with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const customerEmail = searchParams.get("customerEmail");

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (customerEmail) {
      query["customer.email"] = customerEmail.toLowerCase();
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (paymentStatus && paymentStatus !== "all") {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [
        { orderRef: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      customer,
      items,
      deliveryFee: rawDeliveryFee = 0,
      discount: rawDiscount = 0,
      notes,
      source = "whatsapp",
      paymentMethod,
    } = body;

    if (!customer || typeof customer !== "object") {
      return NextResponse.json(
        { error: "Invalid payload", details: "customer is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload", details: "items must be a non-empty array" },
        { status: 400 }
      );
    }

    const name = String(customer.name ?? "").trim();
    const phone = String(customer.phone ?? "").trim();
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Invalid payload", details: "customer.name and customer.phone are required" },
        { status: 400 }
      );
    }

    const deliveryFee = Math.max(0, Number(rawDeliveryFee) || 0);
    const discount = Math.max(0, Number(rawDiscount) || 0);

    const orderItems = items.map((item: OrderItemInput) => {
      const productId = String(item.productId ?? "").trim();
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 0));
      const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
      const productName = String(item.productName ?? "").trim() || "Product";
      const brand = String(item.brand ?? "").trim() || "Unknown";
      const category = String(item.category ?? "").trim() || "Uncategorized";

      if (!productId) {
        throw new Error("Each item must include productId");
      }

      return {
        productId,
        productName,
        brand,
        category,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
      };
    });

    const subtotal = orderItems.reduce((sum, row) => sum + row.totalPrice, 0);
    const total = Math.max(0, subtotal + deliveryFee - discount);

    // Create the order
    const order = new Order({
      customer: {
        name,
        phone,
        address: customer.address ? String(customer.address).trim() : undefined,
        city: customer.city ? String(customer.city).trim() : undefined,
      },
      items: orderItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      notes: notes != null ? String(notes) : undefined,
      source,
      paymentMethod,
      status: "pending",
      paymentStatus: "unpaid",
    });

    await order.save();

    // Update or create customer record
    try {
      await Customer.findOneAndUpdate(
        { phone },
        {
          $set: {
            name,
            phone,
            address: customer.address ? String(customer.address).trim() : undefined,
            city: customer.city ? String(customer.city).trim() : undefined,
          },
          $inc: {
            totalOrders: 1,
            totalSpent: total,
          },
        },
        { upsert: true, new: true, runValidators: true }
      );
    } catch (customerErr) {
      console.error("Order saved but customer upsert failed:", customerErr);
      // Order already persisted — still return success so the dashboard is not stuck.
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);

    if (error instanceof Error && error.message.includes("productId")) {
      return NextResponse.json(
        { error: "Invalid payload", details: error.message },
        { status: 400 }
      );
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Server misconfiguration", details: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
