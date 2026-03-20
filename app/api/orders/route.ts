import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";
import Customer from "@/lib/db/models/Customer";

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
      deliveryFee = 0,
      discount = 0,
      notes,
      source = "whatsapp",
      paymentMethod,
    } = body;

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );
    const total = subtotal + deliveryFee - discount;

    // Prepare items with totalPrice
    const orderItems = items.map(
      (item: { quantity: number; unitPrice: number }) => ({
        ...item,
        totalPrice: item.quantity * item.unitPrice,
      })
    );

    // Create the order
    const order = new Order({
      customer,
      items: orderItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      notes,
      source,
      paymentMethod,
      status: "pending",
      paymentStatus: "unpaid",
    });

    await order.save();

    // Update or create customer record
    if (customer.phone) {
      await Customer.findOneAndUpdate(
        { phone: customer.phone },
        {
          $set: {
            name: customer.name,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
          },
          $inc: {
            totalOrders: 1,
            totalSpent: total,
          },
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
