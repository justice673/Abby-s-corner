"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/app/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, ExternalLink } from "lucide-react";
import { RiArrowUpLine, RiArrowDownLine, RiShoppingBag2Line, RiEyeLine } from "react-icons/ri";

interface DashboardStats {
  today: { sales: number; orders: number };
  yesterday: { sales: number; orders: number };
  categoryStats: { _id: string; totalSales: number; totalQuantity: number }[];
  dailySales: { date: string; sales: number; orders: number }[];
  recentOrders: {
    _id: string;
    orderRef: string;
    customer: { name: string };
    items: { productName: string; totalPrice: number }[];
    total: number;
    status: string;
    createdAt: string;
  }[];
  topProducts: {
    _id: string;
    productName: string;
    brand: string;
    totalSold: number;
    revenue: number;
  }[];
  statusCounts: Record<string, number>;
}

const chartConfig = {
  sales: {
    label: "Sales (FCFA)",
    color: "hsl(0, 0%, 0%)",
  },
  orders: {
    label: "Orders",
    color: "hsl(0, 0%, 50%)",
  },
} satisfies ChartConfig;

const categoryLabels: Record<string, string> = {
  femme: "Women's perfumes",
  homme: "Men's perfumes",
  unisexe: "Unisex",
  maison: "Home & wellness",
  coffrets: "Gift sets",
  arabic: "Arabic perfumes",
  french: "French perfumes",
  english: "English perfumes",
};

const categoryColors: Record<string, string> = {
  femme: "bg-rose-500",
  homme: "bg-sky-500",
  unisexe: "bg-violet-500",
  maison: "bg-emerald-500",
  coffrets: "bg-amber-500",
  arabic: "bg-amber-500",
  french: "bg-rose-500",
  english: "bg-sky-500",
};

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

function formatCompact(amount: number) {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + "M";
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + "K";
  }
  return amount.toString();
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/stats?period=${timeRange}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const todaySales = stats?.today.sales || 0;
  const yesterdaySales = stats?.yesterday.sales || 0;
  const todayOrders = stats?.today.orders || 0;
  const yesterdayOrders = stats?.yesterday.orders || 0;

  const salesChange = yesterdaySales > 0 
    ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 
    : todaySales > 0 ? 100 : 0;
  const ordersChange = yesterdayOrders > 0 
    ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 
    : todayOrders > 0 ? 100 : 0;

  const totalCategorySales = stats?.categoryStats?.reduce((sum, cat) => sum + cat.totalSales, 0) || 1;
  const categoryData = stats?.categoryStats?.map((cat) => ({
    name: categoryLabels[cat._id] || cat._id,
    percentage: Math.round((cat.totalSales / totalCategorySales) * 100),
    color: categoryColors[cat._id] || "bg-gray-500",
  })) || [];

  const pendingOrders = stats?.statusCounts?.pending || 0;
  const processingOrders = (stats?.statusCounts?.confirmed || 0) + 
                          (stats?.statusCounts?.preparing || 0) + 
                          (stats?.statusCounts?.shipped || 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40" />
        </div>
      </DashboardLayout>
    );
  }

  const hasData = stats && (stats.recentOrders?.length > 0 || todaySales > 0 || todayOrders > 0);

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-(--brand-primary)">
              Overview
            </h1>
            <p className="mt-1 text-sm text-(--brand-primary)/60">
              {hasData 
                ? "High-level view of sales, orders and store activity."
                : "Start tracking your sales by logging WhatsApp orders."}
            </p>
          </div>
          <Link href="/dashboard/orders">
            <Button className="bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90">
              <Plus className="mr-2 h-4 w-4" />
              Log Order
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-(--brand-primary)/60">Today&apos;s sales</CardDescription>
              <CardTitle className="text-2xl font-bold text-(--brand-primary)">
                {formatCFA(todaySales)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {yesterdaySales > 0 || todaySales > 0 ? (
                <div className="flex items-center gap-1 text-sm">
                  {salesChange >= 0 ? (
                    <>
                      <RiArrowUpLine className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-600">+{salesChange.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <RiArrowDownLine className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-600">{salesChange.toFixed(1)}%</span>
                    </>
                  )}
                  <span className="text-(--brand-primary)/50">vs yesterday</span>
                </div>
              ) : (
                <p className="text-sm text-(--brand-primary)/50">No sales yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-(--brand-primary)/60">Orders today</CardDescription>
              <CardTitle className="text-2xl font-bold text-(--brand-primary)">
                {todayOrders}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {yesterdayOrders > 0 || todayOrders > 0 ? (
                <div className="flex items-center gap-1 text-sm">
                  {ordersChange >= 0 ? (
                    <>
                      <RiArrowUpLine className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-600">+{ordersChange.toFixed(0)}%</span>
                    </>
                  ) : (
                    <>
                      <RiArrowDownLine className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-600">{ordersChange.toFixed(0)}%</span>
                    </>
                  )}
                  <span className="text-(--brand-primary)/50">vs yesterday</span>
                </div>
              ) : (
                <p className="text-sm text-(--brand-primary)/50">No orders yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-(--brand-primary)/60">Pending orders</CardDescription>
              <CardTitle className="text-2xl font-bold text-(--brand-primary)">
                {pendingOrders}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm">
                <span className="font-medium text-blue-600">{processingOrders}</span>
                <span className="text-(--brand-primary)/50">in progress</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-(--brand-primary)/60">Quick actions</CardDescription>
              <CardTitle className="text-lg font-bold text-(--brand-primary)">
                Manage Store
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Link href="/dashboard/orders" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs text-(--brand-light)">
                    Orders
                  </Button>
                </Link>
                <Link href="/dashboard/products" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs text-(--brand-light)">
                    Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sales Area Chart */}
          <Card className="lg:col-span-2 pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b border-black/10 py-5 sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle className="text-(--brand-primary)">Sales Overview</CardTitle>
                <CardDescription className="text-(--brand-primary)/60">
                  Revenue and orders trend
                </CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="hidden w-[140px] rounded-lg sm:ml-auto sm:flex"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 30 days" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              {stats?.dailySales && stats.dailySales.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[250px] w-full"
                >
                  <AreaChart data={stats.dailySales}>
                    <defs>
                      <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-sales)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-sales)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-orders)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-orders)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.1)" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value: string | number) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            });
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    <Area
                      dataKey="orders"
                      type="natural"
                      fill="url(#fillOrders)"
                      stroke="var(--color-orders)"
                      stackId="a"
                    />
                    <Area
                      dataKey="sales"
                      type="natural"
                      fill="url(#fillSales)"
                      stroke="var(--color-sales)"
                      stackId="b"
                    />
                    <ChartLegend
                      content={({ payload }) => (
                        <div className="flex items-center justify-center gap-4 pt-3">
                          {payload?.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-(--brand-primary)/70">
                              <div
                                className="h-2 w-2 shrink-0 rounded-[2px]"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-xs">
                                {entry.value === "sales" ? "Sales (FCFA)" : "Orders"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[250px] flex-col items-center justify-center text-center">
                  <RiEyeLine className="h-12 w-12 text-(--brand-primary)/20" />
                  <p className="mt-4 text-sm font-medium text-(--brand-primary)">
                    No sales data yet
                  </p>
                  <p className="mt-1 text-xs text-(--brand-primary)/60">
                    Chart will populate as you log orders
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-(--brand-primary)">Sales by Category</CardTitle>
              <CardDescription className="text-(--brand-primary)/60">
                Distribution this period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryData.length > 0 ? (
                categoryData.map((cat) => (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-(--brand-primary)">{cat.name}</span>
                      <span className="font-medium text-(--brand-primary)">{cat.percentage}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-(--brand-primary)/10">
                      <div
                        className={`h-full rounded-full ${cat.color}`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center text-center">
                  <p className="text-sm text-(--brand-primary)/60">
                    No category data yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-(--brand-primary)">Recent Orders</CardTitle>
                <CardDescription className="text-(--brand-primary)/60">
                  Latest customer purchases
                </CardDescription>
              </div>
              <Link href="/dashboard/orders">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {stats.recentOrders.slice(0, 5).map((order) => (
                    <div
                      key={order._id}
                      className="flex flex-col gap-2 border-b border-black/5 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pb-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--brand-primary)/5 sm:h-10 sm:w-10">
                          <RiShoppingBag2Line className="h-4 w-4 text-(--brand-primary) sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-(--brand-primary) truncate">
                            {order.customer.name}
                          </p>
                          <p className="text-xs text-(--brand-primary)/50 truncate">
                            {order.items[0]?.productName || order.orderRef}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pl-12 sm:pl-0 sm:flex-col sm:items-end sm:text-right">
                        <p className="text-sm font-semibold text-(--brand-primary)">
                          {formatCFA(order.total)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-800"}`}
                          >
                            {order.status}
                          </Badge>
                          <span className="text-[10px] text-(--brand-primary)/40">
                            {formatRelativeTime(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center text-center">
                  <RiShoppingBag2Line className="h-12 w-12 text-(--brand-primary)/20" />
                  <p className="mt-4 text-sm font-medium text-(--brand-primary)">
                    No orders yet
                  </p>
                  <p className="mt-1 text-xs text-(--brand-primary)/60">
                    Log your first WhatsApp order to get started
                  </p>
                  <Link href="/dashboard/orders">
                    <Button
                      size="sm"
                      className="mt-4 bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Log Order
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-(--brand-primary)">Top Selling Products</CardTitle>
              <CardDescription className="text-(--brand-primary)/60">
                Best performers this period
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {stats?.topProducts && stats.topProducts.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {stats.topProducts.map((product, idx) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between gap-3 border-b border-black/5 pb-3 last:border-0 last:pb-0 sm:pb-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-(--brand-primary)/5 sm:h-12 sm:w-12">
                            <span className="text-lg font-bold text-(--brand-primary)/30">
                              {idx + 1}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-(--brand-primary) truncate">
                            {product.productName.split(" - ")[0]}
                          </p>
                          <p className="text-xs text-(--brand-primary)/50">{product.brand}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-(--brand-primary) sm:text-sm">
                          {formatCompact(product.revenue)} FCFA
                        </p>
                        <p className="text-[10px] text-(--brand-primary)/50 sm:text-xs">
                          {product.totalSold} sold
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center text-center">
                  <p className="text-sm text-(--brand-primary)/60">
                    No product data yet
                  </p>
                  <p className="mt-1 text-xs text-(--brand-primary)/60">
                    Top products will show as you log orders
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardLayout>
  );
}
