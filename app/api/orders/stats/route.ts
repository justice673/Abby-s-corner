import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";

// GET dashboard statistics
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";

    // Calculate date range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let startDate: Date;
    switch (period) {
      case "30d":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 90);
        break;
      default: // 7d
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
    }

    // Today's stats
    const todayStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    // Yesterday's stats
    const yesterdayStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: yesterday, $lt: today },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    // Sales by category
    const categoryStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "cancelled" },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.category",
          totalSales: { $sum: "$items.totalPrice" },
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    // Daily sales for chart
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent orders
    const recentOrders = await Order.find({ status: { $ne: "cancelled" } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "cancelled" },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.productName" },
          brand: { $first: "$items.brand" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.totalPrice" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Order status counts
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format response
    const todayData = todayStats[0] || { totalSales: 0, orderCount: 0 };
    const yesterdayData = yesterdayStats[0] || { totalSales: 0, orderCount: 0 };

    return NextResponse.json({
      today: {
        sales: todayData.totalSales,
        orders: todayData.orderCount,
      },
      yesterday: {
        sales: yesterdayData.totalSales,
        orders: yesterdayData.orderCount,
      },
      categoryStats,
      dailySales: dailySales.map((d) => ({
        date: d._id,
        sales: d.sales,
        orders: d.orders,
      })),
      recentOrders,
      topProducts,
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
