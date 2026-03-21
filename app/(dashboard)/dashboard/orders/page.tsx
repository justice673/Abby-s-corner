"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Phone,
  MapPin,
  Package,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Clock,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { RiWhatsappLine } from "react-icons/ri";

// Types
interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderRef: string;
  customer: {
    name: string;
    phone: string;
    address?: string;
    city?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "partial" | "paid";
  paymentMethod?: "cash" | "mobile_money" | "bank_transfer" | "other";
  notes?: string;
  source: "whatsapp" | "direct" | "phone" | "other";
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  name: string;
  fullName: string;
  brand: string;
  category: string;
  price: number;
  stockLeft: number;
  image: string;
}


// Status config
const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-200" },
  preparing: { label: "Preparing", color: "bg-purple-100 text-purple-800 border-purple-200" },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200" },
};

const PAYMENT_STATUS_CONFIG = {
  unpaid: { label: "Unpaid", color: "bg-red-100 text-red-800 border-red-200" },
  partial: { label: "Partial", color: "bg-orange-100 text-orange-800 border-orange-200" },
  paid: { label: "Paid", color: "bg-green-100 text-green-800 border-green-200" },
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-CM", { style: "decimal" }).format(amount) + " FCFA";
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format relative time
const formatRelativeTime = (dateString: string) => {
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
  return formatDate(dateString);
};

export default function OrdersPage() {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New order form state
  type OrderSource = Order["source"];
  type PaymentMethod = NonNullable<Order["paymentMethod"]>;

  const [newOrder, setNewOrder] = useState<{
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
    items: { product: Product; quantity: number }[];
    deliveryFee: number;
    discount: number;
    notes: string;
    source: OrderSource;
    paymentMethod: PaymentMethod;
  }>({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    items: [] as { product: Product; quantity: number }[],
    deliveryFee: 0,
    discount: 0,
    notes: "",
    source: "whatsapp" as OrderSource,
    paymentMethod: "cash" as PaymentMethod,
  });
  const [saving, setSaving] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (paymentFilter !== "all") params.append("paymentStatus", paymentFilter);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/orders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, paymentFilter, searchQuery]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  // Add product to order
  const addProductToOrder = (product: Product) => {
    const existing = newOrder.items.find((item) => item.product._id === product._id);
    if (existing) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, { product, quantity: 1 }],
      });
    }
  };

  // Remove product from order
  const removeProductFromOrder = (productId: string) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((item) => item.product._id !== productId),
    });
  };

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setNewOrder({
      ...newOrder,
      items: newOrder.items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      ),
    });
  };

  // Calculate order total
  const calculateSubtotal = () => {
    return newOrder.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() + newOrder.deliveryFee - newOrder.discount;
  };

  // Create order
  const handleCreateOrder = async () => {
    if (!newOrder.customerName || !newOrder.customerPhone || newOrder.items.length === 0) {
      return;
    }

    try {
      setSaving(true);
      const orderData = {
        customer: {
          name: newOrder.customerName,
          phone: newOrder.customerPhone,
          address: newOrder.customerAddress,
          city: newOrder.customerCity,
        },
        items: newOrder.items.map((item) => ({
          productId: item.product._id,
          productName: item.product.fullName,
          brand: item.product.brand,
          category: item.product.category,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        deliveryFee: newOrder.deliveryFee,
        discount: newOrder.discount,
        notes: newOrder.notes,
        source: newOrder.source,
        paymentMethod: newOrder.paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg =
          (errBody as { details?: string; error?: string }).details ||
          (errBody as { error?: string }).error ||
          `Failed to create order (${res.status})`;
        console.error("Create order API:", res.status, errBody);
        throw new Error(msg);
      }

      setCreateDialogOpen(false);
      resetNewOrderForm();
      fetchOrders();
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setSaving(false);
    }
  };

  // Update order status
  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update order");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Update payment status
  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Delete order
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      const res = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete order");
      
      setDeleteDialogOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Reset form
  const resetNewOrderForm = () => {
    setNewOrder({
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      customerCity: "",
      items: [],
      deliveryFee: 0,
      discount: 0,
      notes: "",
      source: "whatsapp",
      paymentMethod: "cash",
    });
  };

  // Open WhatsApp for customer
  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  // Stats: Pending = not yet confirmed. Processing = confirmed→shipped (active pipeline).
  // Completed = terminal success (delivered/completed). Not the same as "Confirmed" badge alone.
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) =>
      ["confirmed", "preparing", "shipped"].includes(o.status)
    ).length,
    completed: orders.filter((o) => o.status === "completed" || o.status === "delivered").length,
    revenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0),
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-(--brand-primary) sm:text-2xl">Orders</h1>
            <p className="text-sm text-(--brand-primary)/60">
              Manage WhatsApp orders and track sales
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="w-fit bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Log New Order
          </Button>
        </div>

        {/* Stats: horizontal scroll on mobile, grid from sm+ */}
        <div className="-mx-1 overflow-x-auto overflow-y-visible pb-1 [-webkit-overflow-scrolling:touch] sm:mx-0 sm:overflow-visible sm:pb-0">
          <div className="flex snap-x snap-mandatory gap-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:snap-none lg:grid-cols-3 xl:grid-cols-5">
          <Card className="min-w-[min(260px,calc(100vw-2.5rem))] shrink-0 snap-start sm:min-w-0 sm:shrink sm:snap-none">
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--brand-primary)/10">
                <ShoppingCart className="h-6 w-6 text-(--brand-primary)" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.total}</p>
                <p className="text-sm text-(--brand-primary)/60">Total Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-[min(260px,calc(100vw-2.5rem))] shrink-0 snap-start sm:min-w-0 sm:shrink sm:snap-none">
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.pending}</p>
                <p className="text-sm text-(--brand-primary)/60">Pending</p>
                <p className="text-xs text-(--brand-primary)/45">Awaiting confirmation</p>
              </div>
            </CardContent>
          </Card>
          <Card
            title="Confirmed, preparing, or shipped"
            className="min-w-[min(260px,calc(100vw-2.5rem))] shrink-0 snap-start sm:min-w-0 sm:shrink sm:snap-none"
          >
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.processing}</p>
                <p className="text-sm text-(--brand-primary)/60">Processing</p>
                <p className="text-xs text-(--brand-primary)/45">Confirmed → shipped</p>
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-[min(260px,calc(100vw-2.5rem))] shrink-0 snap-start sm:min-w-0 sm:shrink sm:snap-none">
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.completed}</p>
                <p className="text-sm text-(--brand-primary)/60">Delivered</p>
                <p className="text-xs text-(--brand-primary)/45">Completed order</p>
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-[min(260px,calc(100vw-2.5rem))] shrink-0 snap-start sm:min-w-0 sm:shrink sm:snap-none">
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{formatPrice(stats.revenue)}</p>
                <p className="text-sm text-(--brand-primary)/60">Revenue</p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="overflow-hidden">
          <CardContent className="px-4 pt-6 sm:px-6">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--brand-primary)/40" />
                <Input
                  placeholder="Search orders, customers, phone..."
                  className="w-full min-w-0 pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:flex sm:w-auto sm:shrink-0 sm:gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full min-w-0 sm:w-[min(100%,160px)] md:w-[170px]">
                    <Filter className="mr-2 h-4 w-4 shrink-0" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-full min-w-0 sm:w-[160px] md:w-[170px]">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card className="overflow-hidden">
          <CardHeader className="space-y-1 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-(--brand-primary)/20" />
                <h3 className="mt-4 text-lg font-medium text-(--brand-primary)">
                  No orders yet
                </h3>
                <p className="mt-1 text-sm text-(--brand-primary)/60">
                  Start by logging your first WhatsApp order
                </p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="mt-4 bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Log New Order
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-(--brand-primary)/2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-(--brand-primary)">
                            {order.orderRef}
                          </span>
                          <Badge
                            variant="outline"
                            className={STATUS_CONFIG[order.status].color}
                          >
                            {STATUS_CONFIG[order.status].label}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={PAYMENT_STATUS_CONFIG[order.paymentStatus].color}
                          >
                            {PAYMENT_STATUS_CONFIG[order.paymentStatus].label}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-(--brand-primary)/70">
                          <span className="font-medium">{order.customer.name}</span>
                          <span>•</span>
                          <span>{order.items.length} item(s)</span>
                          <span>•</span>
                          <span className="font-semibold">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-(--brand-primary)/50">
                          {formatRelativeTime(order.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openWhatsApp(order.customer.phone)}
                        title="Contact on WhatsApp"
                      >
                        <RiWhatsappLine className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedOrder(order);
                          setViewDialogOpen(true);
                        }}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedOrder(order);
                          setEditDialogOpen(true);
                        }}
                        title="Edit order"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedOrder(order);
                          setDeleteDialogOpen(true);
                        }}
                        title="Delete order"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="min-w-0 text-center text-sm text-(--brand-primary)/70">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Order Sheet */}
        <Sheet open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <SheetContent side="right" className="p-0">
            <SheetHeader>
              <SheetTitle>Log New WhatsApp Order</SheetTitle>
              <SheetDescription>
                Record an order received via WhatsApp
              </SheetDescription>
            </SheetHeader>

            <div className="flex min-h-0 flex-1 flex-col text-sm text-(--brand-primary)">
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-(--brand-primary)">Customer Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-(--brand-primary)">
                      Name *
                    </label>
                    <Input
                      placeholder="Customer name"
                      value={newOrder.customerName}
                      className="text-(--brand-primary) placeholder:text-(--brand-primary)/50"
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, customerName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-(--brand-primary)">
                      Phone (WhatsApp) *
                    </label>
                    <Input
                      placeholder="+237 6XX XXX XXX"
                      value={newOrder.customerPhone}
                      className="text-(--brand-primary) placeholder:text-(--brand-primary)/50"
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, customerPhone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-(--brand-primary)">
                      Delivery Address
                    </label>
                    <Input
                      placeholder="Street address"
                      value={newOrder.customerAddress}
                      className="text-(--brand-primary) placeholder:text-(--brand-primary)/50"
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, customerAddress: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-(--brand-primary)">
                      City
                    </label>
                    <Input
                      placeholder="Douala, Yaoundé, etc."
                      value={newOrder.customerCity}
                      className="text-(--brand-primary) placeholder:text-(--brand-primary)/50"
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, customerCity: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="space-y-4">
                <h3 className="font-semibold text-(--brand-primary)">Products *</h3>
                
                {/* Selected Products */}
                {newOrder.items.length > 0 && (
                  <div className="space-y-2">
                    {newOrder.items.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm font-medium text-(--brand-primary)">{item.product.name}</p>
                            <p className="text-xs text-(--brand-primary)/60">
                              {item.product.brand} • {formatCurrency(item.product.price)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-(--brand-light) border-black/15"
                            onClick={() =>
                              updateQuantity(item.product._id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-(--brand-light) border-black/15 "
                            onClick={() =>
                              updateQuantity(item.product._id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProductFromOrder(item.product._id)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Product */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => addProductToOrder(product)}
                        className="rounded-lg border p-3 text-left transition-colors hover:bg-(--brand-primary)/5"
                      >
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-(--brand-primary)/60">{product.brand}</p>
                        <p className="mt-1 text-xs font-semibold text-(--brand-primary)">
                          {formatCurrency(product.price)}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="col-span-4 text-center text-sm text-(--brand-primary)/60 py-4">
                      No products found. Add products in the Products page first.
                    </p>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-(--brand-primary)">Order Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-(--brand-primary)">
                      Delivery Fee (FCFA)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newOrder.deliveryFee || ""}
                      className="text-(--brand-primary) placeholder:text-(--brand-primary)/50"
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          deliveryFee: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-(--brand-primary)">
                      Discount (FCFA)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newOrder.discount || ""}
                      className="text-(--brand-primary) placeholder:text-(--brand-primary)/50"
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          discount: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-(--brand-primary)">
                      Order Source
                    </label>
                    <Select
                      value={newOrder.source}
                      onValueChange={(value: "whatsapp" | "direct" | "phone" | "other") =>
                        setNewOrder({ ...newOrder, source: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="direct">Walk-in</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-(--brand-primary)">
                      Payment Method
                    </label>
                    <Select
                      value={newOrder.paymentMethod}
                      onValueChange={(value: "cash" | "mobile_money" | "bank_transfer" | "other") =>
                        setNewOrder({ ...newOrder, paymentMethod: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash on Delivery</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--brand-primary)">
                    Notes
                  </label>
                  <Input
                    placeholder="Any special instructions..."
                    value={newOrder.notes}
                    className="text-(--brand-primary) placeholder:text-(--brand-primary)/50"
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Order Summary */}
              {newOrder.items.length > 0 && (
                <div className="rounded-lg bg-(--brand-primary)/5 p-4">
                  <h3 className="mb-3 font-semibold text-(--brand-primary)">
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-(--brand-primary)/70">Subtotal</span>
                      <span>{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-(--brand-primary)/70">Delivery Fee</span>
                      <span>{formatCurrency(newOrder.deliveryFee)}</span>
                    </div>
                    {newOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(newOrder.discount)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-(--brand-primary)">Total</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>

              <SheetFooter>
                <Button
                  variant="outline"
                  className="text-(--brand-light) border-black/15"
                  onClick={() => {
                    setCreateDialogOpen(false);
                    resetNewOrderForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateOrder}
                  disabled={
                    !newOrder.customerName ||
                    !newOrder.customerPhone ||
                    newOrder.items.length === 0 ||
                    saving
                  }
                  className="bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Order
                </Button>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>

        {/* View Order Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold">
                    {selectedOrder.orderRef}
                  </span>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={STATUS_CONFIG[selectedOrder.status].color}
                    >
                      {STATUS_CONFIG[selectedOrder.status].label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus].color}
                    >
                      {PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus].label}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">Customer</h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="flex items-center gap-2 text-(--brand-primary)/70">
                      <Phone className="h-3 w-3" />
                      {selectedOrder.customer.phone}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => openWhatsApp(selectedOrder.customer.phone)}
                      >
                        <RiWhatsappLine className="h-4 w-4 text-green-600" />
                      </Button>
                    </p>
                    {selectedOrder.customer.address && (
                      <p className="flex items-center gap-2 text-(--brand-primary)/70">
                        <MapPin className="h-3 w-3" />
                        {selectedOrder.customer.address}
                        {selectedOrder.customer.city && `, ${selectedOrder.customer.city}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>
                          {item.productName} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery</span>
                        <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>-{formatCurrency(selectedOrder.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-semibold">Notes</h4>
                    <p className="text-sm text-(--brand-primary)/70">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                <div className="text-xs text-(--brand-primary)/50">
                  Created: {formatDate(selectedOrder.createdAt)}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Order Dialog (Status Update) */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                {selectedOrder?.orderRef} - {selectedOrder?.customer.name}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Status</label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) =>
                      handleUpdateStatus(selectedOrder._id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--brand-primary)">
                    Payment Status
                  </label>
                  <Select
                    value={selectedOrder.paymentStatus}
                    onValueChange={(value) =>
                      handleUpdatePaymentStatus(selectedOrder._id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="partial">Partial Payment</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                className="text-(--brand-light) border-black/15 hover:bg-(--brand-primary)/5"
                onClick={() => setEditDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Order?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete order {selectedOrder?.orderRef}? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteOrder}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
