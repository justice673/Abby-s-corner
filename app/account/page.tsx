"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Package,
  User,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ArrowLeft,
  Loader2,
  ShoppingBag,
} from "lucide-react";

interface Order {
  _id: string;
  orderRef: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600 bg-amber-50",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-blue-600 bg-blue-50",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-purple-600 bg-purple-50",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600 bg-red-50",
  },
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/account");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?customerEmail=${session?.user?.email}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-(--brand-light) flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-(--brand-light)">
      {/* Header */}
      <header className="bg-white border-b border-black/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-(--brand-primary)/70 hover:text-(--brand-primary) transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-(--brand-primary) flex items-center justify-center text-white text-xs font-bold">
              AC
            </div>
            <span className="text-sm font-semibold text-(--brand-primary) hidden sm:block">
              Abby&apos;s Corner
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-(--brand-primary)">
            Welcome, {user.name}
          </h1>
          <p className="text-sm text-(--brand-primary)/60 mt-1">
            Manage your account and view your orders
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
              {/* Profile Card */}
              <div className="p-6 border-b border-black/10">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-(--brand-primary)/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-(--brand-primary)" />
                  </div>
                  <div>
                    <p className="font-semibold text-(--brand-primary)">
                      {user.name}
                    </p>
                    <p className="text-sm text-(--brand-primary)/60">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-(--brand-primary)/5 text-(--brand-primary)">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">My Orders</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-(--brand-primary)/70 hover:bg-red-50 hover:text-red-600 transition-colors mt-1"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
              <div className="p-6 border-b border-black/10">
                <h2 className="text-lg font-semibold text-(--brand-primary)">
                  My Orders
                </h2>
                <p className="text-sm text-(--brand-primary)/60 mt-1">
                  Track and manage your orders
                </p>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40 mx-auto" />
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-(--brand-primary)/5 flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-(--brand-primary)/40" />
                  </div>
                  <p className="text-(--brand-primary)/60 mb-4">
                    You haven&apos;t placed any orders yet
                  </p>
                  <Button asChild className="bg-(--brand-primary) text-white">
                    <Link href="/">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {orders.map((order) => {
                    const statusInfo = statusConfig[order.status];
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div
                        key={order._id}
                        className="p-6 hover:bg-black/[0.02] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="font-semibold text-(--brand-primary)">
                              {order.orderRef}
                            </p>
                            <p className="text-xs text-(--brand-primary)/50 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusInfo.label}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-(--brand-primary)/70">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="text-(--brand-primary)">
                                {item.price.toLocaleString()} FCFA
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-(--brand-primary)/50">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                          <span className="text-sm font-medium text-(--brand-primary)">
                            Total
                          </span>
                          <span className="font-semibold text-(--brand-primary)">
                            {order.total.toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
