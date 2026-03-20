"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/app/components/ui/sheet";
import { Input } from "@/app/components/ui/input";
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
import { RiAddCircleLine, RiEyeLine, RiEdit2Line, RiDeleteBinLine } from "react-icons/ri";
import { Loader2, Package, DollarSign, AlertTriangle, TrendingUp, Upload, X } from "lucide-react";
import { formatPriceCFA } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  fullName: string;
  brand: string;
  tags: string[];
  condition: string;
  category: string;
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
}

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

const defaultFormData = {
  name: "",
  fullName: "",
  brand: "",
  category: "femme",
  volume: "",
  price: "",
  stockLeft: "",
  condition: "New with tag",
  tete: "",
  coeur: "",
  fond: "",
  description: "",
  image: "/images/product-1.jpg",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState(defaultFormData);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "abbys-corner/products");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products?activeOnly=false");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddTag = () => {
    const raw = tagInput.trim();
    if (!raw) return;

    const parts = raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      setTagInput("");
      return;
    }

    setTags((prev) => {
      const existing = new Set(prev.map((t) => t.toLowerCase()));
      const next = [...prev];

      for (const part of parts) {
        const key = part.toLowerCase();
        if (!existing.has(key)) {
          existing.add(key);
          next.push(part);
        }
      }

      return next;
    });

    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setTags([]);
    setTagInput("");
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      fullName: product.fullName,
      brand: product.brand,
      category: product.category,
      volume: product.volume,
      price: product.price.toString(),
      stockLeft: product.stockLeft.toString(),
      condition: product.condition,
      tete: product.tete || "",
      coeur: product.coeur || "",
      fond: product.fond || "",
      description: product.description || "",
      image: product.image || "/images/product-1.jpg",
    });
    const normalizedTags =
      product.tags
        ?.flatMap((tag) =>
          tag
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        ) || [];
    const uniqueNormalized = Array.from(
      new Map(
        normalizedTags.map((t) => [t.toLowerCase(), t])
      ).values()
    );
    setTags(uniqueNormalized);
    setEditOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.brand || !formData.price) return;

    try {
      setSaving(true);
      const productData = {
        name: formData.name || formData.fullName.split(" - ")[0],
        fullName: formData.fullName,
        brand: formData.brand,
        category: formData.category,
        volume: formData.volume,
        price: parseInt(formData.price) || 0,
        stockLeft: parseInt(formData.stockLeft) || 0,
        condition: formData.condition,
        tete: formData.tete,
        coeur: formData.coeur,
        fond: formData.fond,
        description: formData.description,
        tags,
        image: formData.image,
        images: [formData.image],
        isActive: true,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        setAddOpen(false);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setSaving(true);
      const productData = {
        name: formData.name || formData.fullName.split(" - ")[0],
        fullName: formData.fullName,
        brand: formData.brand,
        category: formData.category,
        volume: formData.volume,
        price: parseInt(formData.price) || 0,
        stockLeft: parseInt(formData.stockLeft) || 0,
        condition: formData.condition,
        tete: formData.tete,
        coeur: formData.coeur,
        fond: formData.fond,
        description: formData.description,
        tags,
      };

      const res = await fetch(`/api/products/${selectedProduct._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        setEditOpen(false);
        resetForm();
        setSelectedProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      const res = await fetch(`/api/products/${selectedProduct._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteOpen(false);
        setSelectedProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of stock", class: "bg-red-100 text-red-700" };
    if (stock < 5) return { label: "Low", class: "bg-amber-100 text-amber-800" };
    return { label: "In stock", class: "bg-emerald-100 text-emerald-800" };
  };

  // Calculate stats
  const stats = {
    total: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stockLeft, 0),
    lowStock: products.filter((p) => p.stockLeft > 0 && p.stockLeft < 5).length,
    outOfStock: products.filter((p) => p.stockLeft === 0).length,
  };

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-(--brand-primary)">
              Products
            </h1>
            <p className="mt-1 text-sm text-(--brand-primary)/70">
              Manage the perfumes currently available in Abby&apos;s Corner.
            </p>
          </div>
          <Button
            size="sm"
            className="inline-flex items-center gap-2 bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
            onClick={() => {
              resetForm();
              setAddOpen(true);
            }}
          >
            <RiAddCircleLine className="h-4 w-4" />
            Add product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--brand-primary)/10">
                <Package className="h-6 w-6 text-(--brand-primary)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.total}</p>
                <p className="text-sm text-(--brand-primary)/60">Total Products</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{formatPriceCFA(stats.totalValue)}</p>
                <p className="text-sm text-(--brand-primary)/60">Stock Value</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.lowStock}</p>
                <p className="text-sm text-(--brand-primary)/60">Low Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.outOfStock}</p>
                <p className="text-sm text-(--brand-primary)/60">Out of Stock</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All products</CardTitle>
            <CardDescription>
              Quick view of your catalogue: name, category, price and stock.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-(--brand-primary)/20" />
                <h3 className="mt-4 text-lg font-medium text-(--brand-primary)">
                  No products yet
                </h3>
                <p className="mt-1 text-sm text-(--brand-primary)/60">
                  Add your first product to get started
                </p>
                <Button
                  onClick={() => {
                    resetForm();
                    setAddOpen(true);
                  }}
                  className="mt-4 bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
                >
                  <RiAddCircleLine className="mr-2 h-4 w-4" />
                  Add product
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b text-xs uppercase text-(--brand-primary)/60">
                    <tr>
                      <th className="py-2 pr-3 font-medium">Product</th>
                      <th className="py-2 px-3 font-medium">Category</th>
                      <th className="py-2 px-3 font-medium">Price</th>
                      <th className="py-2 px-3 font-medium">Stock</th>
                      <th className="py-2 pl-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const categoryLabel = categoryLabels[product.category] ?? product.category;
                      const stockStatus = getStockStatus(product.stockLeft);

                      return (
                        <tr key={product._id} className="border-b last:border-0">
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/5">
                                <img
                                  src={product.image || "/images/product-1.jpg"}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-(--brand-primary)">
                                  {product.fullName}
                                </span>
                                <span className="text-xs text-(--brand-primary)/55">
                                  {product.brand}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-xs text-(--brand-primary)/55">
                              {categoryLabel}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-sm font-medium text-(--brand-primary)">
                              {formatPriceCFA(product.price)}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-(--brand-primary)">
                                {product.stockLeft}
                              </span>
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${stockStatus.class}`}>
                                {stockStatus.label}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pl-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-(--brand-primary)"
                                aria-label="View product"
                                onClick={() => handleView(product)}
                              >
                                <RiEyeLine className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-(--brand-primary)"
                                aria-label="Edit product"
                                onClick={() => handleEdit(product)}
                              >
                                <RiEdit2Line className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                                aria-label="Delete product"
                                onClick={() => handleDelete(product)}
                              >
                                <RiDeleteBinLine className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Product Sheet */}
        <Sheet open={addOpen} onOpenChange={setAddOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Add product</SheetTitle>
              <SheetDescription>
                Create a new perfume in your catalogue.
              </SheetDescription>
            </SheetHeader>
            <form
              className="flex min-h-0 flex-1 flex-col text-sm text-(--brand-primary)"
              onSubmit={handleCreateProduct}
            >
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                    Product name *
                  </label>
                  <Input
                    placeholder="AVENTUS - EAU DE PARFUM"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                    Brand *
                  </label>
                  <Input
                    placeholder="CREED"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                      Category
                    </label>
                    <select
                      className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm text-(--brand-primary)"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                      Volume
                    </label>
                    <Input
                      placeholder="100 ml"
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                      Price (FCFA) *
                    </label>
                    <Input
                      type="number"
                      placeholder="144320"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                      Stock
                    </label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={formData.stockLeft}
                      onChange={(e) => setFormData({ ...formData, stockLeft: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                    Condition
                  </label>
                  <select
                    className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm text-(--brand-primary)"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  >
                    <option>New with tag</option>
                    <option>Very good condition</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                      Top note
                    </label>
                    <Input
                      placeholder="Bergamot"
                      value={formData.tete}
                      onChange={(e) => setFormData({ ...formData, tete: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                      Heart
                    </label>
                    <Input
                      placeholder="Rose"
                      value={formData.coeur}
                      onChange={(e) => setFormData({ ...formData, coeur: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                      Base
                    </label>
                    <Input
                      placeholder="Oud"
                      value={formData.fond}
                      onChange={(e) => setFormData({ ...formData, fond: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                    Description
                  </label>
                  <textarea
                    className="min-h-[80px] w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-(--brand-primary) outline-none"
                    placeholder="Short description of the perfume…"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                    Tags
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      placeholder="Oud, citrus, vanilla…"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="h-9 w-full flex-1 min-w-[160px]"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddTag}
                      className="bg-(--brand-primary) text-(--brand-light) hover:bg-(--brand-primary)/90"
                    >
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="inline-flex items-center gap-1 rounded-full bg-(--brand-primary)/5 px-3 py-1 text-xs font-medium text-(--brand-primary) hover:bg-(--brand-primary)/10"
                        >
                          <span>{tag}</span>
                          <span className="text-[10px] opacity-70">×</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                    Product Image
                  </label>
                  {formData.image && formData.image !== "/images/product-1.jpg" ? (
                    <div className="relative">
                      <div className="h-32 w-full rounded-xl overflow-hidden bg-black/5 border border-black/10">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/product-1.jpg";
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: "/images/product-1.jpg" })}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-black/20 bg-black/[0.02] px-4 py-6 transition hover:border-black/40 hover:bg-black/[0.04]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                        disabled={uploading}
                      />
                      {uploading ? (
                        <>
                          <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40" />
                          <p className="mt-2 text-sm text-(--brand-primary)/60">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--brand-primary)/10">
                            <Upload className="h-5 w-5 text-(--brand-primary)" />
                          </div>
                          <p className="mt-2 text-sm font-medium text-(--brand-primary)">
                            Click to upload
                          </p>
                          <p className="mt-1 text-xs text-(--brand-primary)/50">
                            PNG, JPG, WEBP up to 5MB
                          </p>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>
              <SheetFooter className="border-t border-black/10 p-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
                  disabled={saving}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save product
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* View Product Sheet */}
        <Sheet open={viewOpen} onOpenChange={setViewOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Product details</SheetTitle>
              <SheetDescription>
                View complete information about this product.
              </SheetDescription>
            </SheetHeader>
            {selectedProduct && (
              <div className="flex min-h-0 flex-1 flex-col text-sm text-(--brand-primary)">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                  <div className="aspect-square w-full overflow-hidden rounded-xl border border-black/10 bg-black/5">
                    <img
                      src={selectedProduct.image || "/images/product-1.jpg"}
                      alt={selectedProduct.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.15em] text-(--brand-primary)/50">
                      {selectedProduct.brand}
                    </p>
                    <h3 className="text-lg font-semibold text-(--brand-primary)">
                      {selectedProduct.fullName}
                    </h3>
                    <p className="text-xl font-bold text-(--brand-primary)">
                      {formatPriceCFA(selectedProduct.price)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-(--brand-primary)/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-(--brand-primary)/50">Category</p>
                      <p className="mt-0.5 font-medium">{categoryLabels[selectedProduct.category] ?? selectedProduct.category}</p>
                    </div>
                    <div className="rounded-lg bg-(--brand-primary)/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-(--brand-primary)/50">Volume</p>
                      <p className="mt-0.5 font-medium">{selectedProduct.volume || "N/A"}</p>
                    </div>
                    <div className="rounded-lg bg-(--brand-primary)/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-(--brand-primary)/50">Stock</p>
                      <p className="mt-0.5 font-medium">{selectedProduct.stockLeft} units</p>
                    </div>
                    <div className="rounded-lg bg-(--brand-primary)/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-(--brand-primary)/50">Condition</p>
                      <p className="mt-0.5 font-medium">{selectedProduct.condition}</p>
                    </div>
                  </div>
                  {(selectedProduct.tete || selectedProduct.coeur || selectedProduct.fond) && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.15em] text-(--brand-primary)/50">Scent Profile</p>
                      <div className="space-y-1.5">
                        {selectedProduct.tete && (
                          <div className="flex items-center gap-2">
                            <span className="w-14 text-xs text-(--brand-primary)/60">Top:</span>
                            <span className="text-sm font-medium">{selectedProduct.tete}</span>
                          </div>
                        )}
                        {selectedProduct.coeur && (
                          <div className="flex items-center gap-2">
                            <span className="w-14 text-xs text-(--brand-primary)/60">Heart:</span>
                            <span className="text-sm font-medium">{selectedProduct.coeur}</span>
                          </div>
                        )}
                        {selectedProduct.fond && (
                          <div className="flex items-center gap-2">
                            <span className="w-14 text-xs text-(--brand-primary)/60">Base:</span>
                            <span className="text-sm font-medium">{selectedProduct.fond}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.15em] text-(--brand-primary)/50">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-(--brand-primary)/5 px-3 py-1 text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProduct.description && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.15em] text-(--brand-primary)/50">Description</p>
                      <p className="text-sm leading-relaxed text-(--brand-primary)/80">{selectedProduct.description}</p>
                    </div>
                  )}
                </div>
                <SheetFooter className="border-t border-black/10 p-4">
                  <Button type="button" variant="ghost" onClick={() => setViewOpen(false)}>
                    Close
                  </Button>
                  <Button
                    type="button"
                    className="bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
                    onClick={() => {
                      setViewOpen(false);
                      handleEdit(selectedProduct);
                    }}
                  >
                    Edit product
                  </Button>
                </SheetFooter>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Edit Product Sheet */}
        <Sheet open={editOpen} onOpenChange={setEditOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit product</SheetTitle>
              <SheetDescription>Update the details of this product.</SheetDescription>
            </SheetHeader>
            {selectedProduct && (
              <form className="flex min-h-0 flex-1 flex-col text-sm text-(--brand-primary)" onSubmit={handleUpdateProduct}>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Product name</label>
                    <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Brand</label>
                    <Input value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Category</label>
                      <select
                        className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Volume</label>
                      <Input value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Price (FCFA)</label>
                      <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Stock</label>
                      <Input type="number" value={formData.stockLeft} onChange={(e) => setFormData({ ...formData, stockLeft: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Top note</label>
                      <Input value={formData.tete} onChange={(e) => setFormData({ ...formData, tete: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Heart</label>
                      <Input value={formData.coeur} onChange={(e) => setFormData({ ...formData, coeur: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Base</label>
                      <Input value={formData.fond} onChange={(e) => setFormData({ ...formData, fond: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Description</label>
                    <textarea
                      className="min-h-[80px] w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Tags</label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        placeholder="Add a tag…"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                        className="h-9 flex-1 min-w-[160px]"
                      />
                      <Button type="button" size="sm" onClick={handleAddTag} className="bg-(--brand-primary) text-(--brand-light) hover:bg-(--brand-primary)/90">Add</Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <button key={tag} type="button" onClick={() => handleRemoveTag(tag)} className="inline-flex items-center gap-1 rounded-full bg-(--brand-primary)/5 px-3 py-1 text-xs font-medium hover:bg-(--brand-primary)/10">
                            <span>{tag}</span>
                            <span className="text-[10px] opacity-70">×</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Image Upload */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                      Product Image
                    </label>
                    {formData.image && formData.image !== "/images/product-1.jpg" ? (
                      <div className="relative">
                        <div className="h-32 w-full rounded-xl overflow-hidden bg-black/5 border border-black/10">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/product-1.jpg";
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: "/images/product-1.jpg" })}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-black/20 bg-black/[0.02] px-4 py-6 transition hover:border-black/40 hover:bg-black/[0.04]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                          disabled={uploading}
                        />
                        {uploading ? (
                          <>
                            <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40" />
                            <p className="mt-2 text-sm text-(--brand-primary)/60">Uploading...</p>
                          </>
                        ) : (
                          <>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--brand-primary)/10">
                              <Upload className="h-5 w-5 text-(--brand-primary)" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-(--brand-primary)">
                              Click to upload
                            </p>
                            <p className="mt-1 text-xs text-(--brand-primary)/50">
                              PNG, JPG, WEBP up to 5MB
                            </p>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                </div>
                <SheetFooter className="border-t border-black/10 p-4">
                  <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save changes
                  </Button>
                </SheetFooter>
              </form>
            )}
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold">{selectedProduct?.fullName}</span>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </DashboardLayout>
  );
}
