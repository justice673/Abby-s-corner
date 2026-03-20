"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
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
import { Loader2, Tags, LayoutGrid, Eye, EyeOff, Home, Upload, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  type: "core" | "secondary" | "utility";
  isActive: boolean;
  showInNav: boolean;
  navOrder: number;
  description?: string;
  image?: string;
  sortOrder: number;
  showOnHomepage?: boolean;
  homepageArea?: string;
  homepageSubtitle?: string;
  homepageHighlight?: string;
  homepageBullets?: string[];
  homepageCta?: string;
}

const defaultFormData = {
  name: "",
  slug: "",
  type: "core" as "core" | "secondary" | "utility",
  isActive: true,
  showInNav: false,
  navOrder: 0,
  description: "",
  image: "/images/product-1.jpg",
  showOnHomepage: false,
  homepageArea: "",
  homepageSubtitle: "",
  homepageHighlight: "",
  homepageBullets: "",
  homepageCta: "",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState(defaultFormData);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "abbys-corner/categories");

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

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories?activeOnly=false");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setViewOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      type: category.type,
      isActive: category.isActive,
      showInNav: category.showInNav || false,
      navOrder: category.navOrder || 0,
      description: category.description || "",
      image: category.image || "/images/product-1.jpg",
      showOnHomepage: category.showOnHomepage || false,
      homepageArea: category.homepageArea || "",
      homepageSubtitle: category.homepageSubtitle || "",
      homepageHighlight: category.homepageHighlight || "",
      homepageBullets: (category.homepageBullets || []).join(", "),
      homepageCta: category.homepageCta || "",
    });
    setEditOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setSaving(true);
      const categoryData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        type: formData.type,
        isActive: formData.isActive,
        showInNav: formData.showInNav,
        navOrder: formData.navOrder,
        description: formData.description,
        image: formData.image,
        showOnHomepage: formData.showOnHomepage,
        homepageArea: formData.homepageArea || null,
        homepageSubtitle: formData.homepageSubtitle,
        homepageHighlight: formData.homepageHighlight,
        homepageBullets: formData.homepageBullets
          ? formData.homepageBullets.split(",").map((b) => b.trim()).filter(Boolean)
          : [],
        homepageCta: formData.homepageCta,
      };

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      if (res.ok) {
        setAddOpen(false);
        resetForm();
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      setSaving(true);
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        type: formData.type,
        isActive: formData.isActive,
        showInNav: formData.showInNav,
        navOrder: formData.navOrder,
        description: formData.description,
        image: formData.image,
        showOnHomepage: formData.showOnHomepage,
        homepageArea: formData.homepageArea || null,
        homepageSubtitle: formData.homepageSubtitle,
        homepageHighlight: formData.homepageHighlight,
        homepageBullets: formData.homepageBullets
          ? formData.homepageBullets.split(",").map((b) => b.trim()).filter(Boolean)
          : [],
        homepageCta: formData.homepageCta,
      };

      const res = await fetch(`/api/categories/${selectedCategory._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      if (res.ok) {
        setEditOpen(false);
        resetForm();
        setSelectedCategory(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      const res = await fetch(`/api/categories/${selectedCategory._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteOpen(false);
        setSelectedCategory(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Calculate stats
  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.isActive).length,
    inactive: categories.filter((c) => !c.isActive).length,
    onHomepage: categories.filter((c) => c.showOnHomepage).length,
  };

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-(--brand-primary)">
              Categories
            </h1>
            <p className="mt-1 text-sm text-(--brand-primary)/70">
              Manage the sections customers explore on the store.
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
            Add category
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--brand-primary)/10">
                <LayoutGrid className="h-6 w-6 text-(--brand-primary)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.total}</p>
                <p className="text-sm text-(--brand-primary)/60">Total Categories</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <Eye className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.active}</p>
                <p className="text-sm text-(--brand-primary)/60">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <EyeOff className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.inactive}</p>
                <p className="text-sm text-(--brand-primary)/60">Hidden</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.onHomepage}</p>
                <p className="text-sm text-(--brand-primary)/60">On Homepage</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All categories</CardTitle>
            <CardDescription>
              French, English, Arabic, Home & wellness, Gift sets and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40" />
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Tags className="h-12 w-12 text-(--brand-primary)/20" />
                <h3 className="mt-4 text-lg font-medium text-(--brand-primary)">
                  No categories yet
                </h3>
                <p className="mt-1 text-sm text-(--brand-primary)/60">
                  Add your first category to organize products
                </p>
                <Button
                  onClick={() => {
                    resetForm();
                    setAddOpen(true);
                  }}
                  className="mt-4 bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
                >
                  <RiAddCircleLine className="mr-2 h-4 w-4" />
                  Add category
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b text-xs uppercase text-(--brand-primary)/60">
                    <tr>
                      <th className="py-2 pr-3 font-medium">Name</th>
                      <th className="py-2 px-3 font-medium">Type</th>
                      <th className="py-2 px-3 font-medium">Status</th>
                      <th className="py-2 px-3 font-medium">In Nav</th>
                      <th className="py-2 pl-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat._id} className="border-b last:border-0">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/5">
                              <img
                                src={cat.image || "/images/product-1.jpg"}
                                alt={cat.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-(--brand-primary)">
                                {cat.name}
                              </span>
                              <span className="text-xs text-(--brand-primary)/50">
                                /{cat.slug}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={cat.type === "core" ? "secondary" : "outline"}>
                            {getTypeLabel(cat.type)}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              cat.isActive
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {cat.isActive ? "Visible" : "Hidden"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {cat.showInNav ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                              #{cat.navOrder || 0}
                            </span>
                          ) : (
                            <span className="text-xs text-(--brand-primary)/40">—</span>
                          )}
                        </td>
                        <td className="py-3 pl-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-(--brand-primary)"
                              onClick={() => handleView(cat)}
                            >
                              <RiEyeLine className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-(--brand-primary)"
                              onClick={() => handleEdit(cat)}
                            >
                              <RiEdit2Line className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => handleDelete(cat)}
                            >
                              <RiDeleteBinLine className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Category Sheet */}
        <Sheet open={addOpen} onOpenChange={setAddOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Add category</SheetTitle>
              <SheetDescription>
                Create a new store category.
              </SheetDescription>
            </SheetHeader>
            <form className="flex min-h-0 flex-1 flex-col text-sm text-(--brand-primary)" onSubmit={handleCreateCategory}>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                    Image
                  </label>
                  {formData.image ? (
                    <div className="relative overflow-hidden rounded-xl border border-black/10 bg-black/5">
                      <img
                        src={formData.image}
                        alt={formData.name || "Category image"}
                        className="h-40 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
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
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Name *</label>
                  <Input
                    placeholder="French perfumes"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Slug</label>
                  <Input
                    placeholder="french-perfumes"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Type</label>
                    <select
                      className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as "core" | "secondary" | "utility" })}
                    >
                      <option value="core">Core</option>
                      <option value="secondary">Secondary</option>
                      <option value="utility">Utility</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Status</label>
                    <select
                      className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                      value={formData.isActive ? "visible" : "hidden"}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "visible" })}
                    >
                      <option value="visible">Visible</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3 rounded-lg border border-black/10 bg-black/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-(--brand-primary)">Show in navigation</p>
                      <p className="text-xs text-(--brand-primary)/50">Display this category in the main navbar</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={formData.showInNav}
                        onChange={(e) => setFormData({ ...formData, showInNav: e.target.checked })}
                      />
                      <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-(--brand-primary) peer-checked:after:translate-x-full peer-checked:after:border-white" />
                    </label>
                  </div>
                  {formData.showInNav && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Nav Order</label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="1"
                        value={formData.navOrder}
                        onChange={(e) => setFormData({ ...formData, navOrder: parseInt(e.target.value) || 0 })}
                      />
                      <p className="text-xs text-(--brand-primary)/50">Lower numbers appear first in the navbar</p>
                    </div>
                  )}
                </div>

                {/* Homepage Display Settings */}
                <div className="space-y-3 rounded-lg border border-black/10 bg-black/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-(--brand-primary)">Show on homepage</p>
                      <p className="text-xs text-(--brand-primary)/50">Display in the homepage categories grid</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={formData.showOnHomepage}
                        onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                      />
                      <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-(--brand-primary) peer-checked:after:translate-x-full peer-checked:after:border-white" />
                    </label>
                  </div>
                  {formData.showOnHomepage && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Grid Position</label>
                        <select
                          className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                          value={formData.homepageArea}
                          onChange={(e) => setFormData({ ...formData, homepageArea: e.target.value })}
                        >
                          <option value="">Select position...</option>
                          <option value="a">A - Large left (main feature)</option>
                          <option value="b">B - Top right</option>
                          <option value="c">C - Middle center</option>
                          <option value="d">D - Middle right</option>
                          <option value="e">E - Bottom left</option>
                          <option value="f">F - Top far right</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Subtitle</label>
                        <Input
                          placeholder="Short description for homepage"
                          value={formData.homepageSubtitle}
                          onChange={(e) => setFormData({ ...formData, homepageSubtitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Highlight Text</label>
                        <Input
                          placeholder="e.g., BESTSELLERS, UP TO 30% OFF"
                          value={formData.homepageHighlight}
                          onChange={(e) => setFormData({ ...formData, homepageHighlight: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Button Text</label>
                        <Input
                          placeholder="e.g., Explore, Shop Now"
                          value={formData.homepageCta}
                          onChange={(e) => setFormData({ ...formData, homepageCta: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Description</label>
                  <textarea
                    className="min-h-[100px] w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none"
                    placeholder="Describe the category…"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <SheetFooter className="border-t border-black/10 p-4">
                <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save category
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* View Category Sheet */}
        <Sheet open={viewOpen} onOpenChange={setViewOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Category details</SheetTitle>
              <SheetDescription>View category information.</SheetDescription>
            </SheetHeader>
            {selectedCategory && (
              <div className="flex min-h-0 flex-1 flex-col text-sm text-(--brand-primary)">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-black/10 bg-black/5">
                    <img
                      src={selectedCategory.image || "/images/product-1.jpg"}
                      alt={selectedCategory.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedCategory.type === "core" ? "secondary" : "outline"}>
                        {getTypeLabel(selectedCategory.type)}
                      </Badge>
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${selectedCategory.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
                        {selectedCategory.isActive ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{selectedCategory.name}</h3>
                    <p className="text-xs text-(--brand-primary)/50">/{selectedCategory.slug}</p>
                  </div>
                  {selectedCategory.description && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.15em] text-(--brand-primary)/50">Description</p>
                      <p className="text-sm leading-relaxed text-(--brand-primary)/80">{selectedCategory.description}</p>
                    </div>
                  )}
                </div>
                <SheetFooter className="border-t border-black/10 p-4">
                  <Button type="button" variant="ghost" onClick={() => setViewOpen(false)}>Close</Button>
                  <Button
                    type="button"
                    className="bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
                    onClick={() => {
                      setViewOpen(false);
                      handleEdit(selectedCategory);
                    }}
                  >
                    Edit category
                  </Button>
                </SheetFooter>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Edit Category Sheet */}
        <Sheet open={editOpen} onOpenChange={setEditOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit category</SheetTitle>
              <SheetDescription>Update category details.</SheetDescription>
            </SheetHeader>
            {selectedCategory && (
              <form className="flex min-h-0 flex-1 flex-col text-sm text-(--brand-primary)" onSubmit={handleUpdateCategory}>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                      Image
                    </label>
                    {formData.image ? (
                      <div className="relative overflow-hidden rounded-xl border border-black/10 bg-black/5">
                        <img
                          src={formData.image}
                          alt={formData.name || "Category image"}
                          className="h-40 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: "" })}
                          className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
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
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Name</label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Slug</label>
                    <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Type</label>
                      <select
                        className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as "core" | "secondary" | "utility" })}
                      >
                        <option value="core">Core</option>
                        <option value="secondary">Secondary</option>
                        <option value="utility">Utility</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Status</label>
                      <select
                        className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                        value={formData.isActive ? "visible" : "hidden"}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "visible" })}
                      >
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3 rounded-lg border border-black/10 bg-black/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-(--brand-primary)">Show in navigation</p>
                        <p className="text-xs text-(--brand-primary)/50">Display this category in the main navbar</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={formData.showInNav}
                          onChange={(e) => setFormData({ ...formData, showInNav: e.target.checked })}
                        />
                        <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-(--brand-primary) peer-checked:after:translate-x-full peer-checked:after:border-white" />
                      </label>
                    </div>
                    {formData.showInNav && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Nav Order</label>
                        <Input
                          type="number"
                          min="0"
                          placeholder="1"
                          value={formData.navOrder}
                          onChange={(e) => setFormData({ ...formData, navOrder: parseInt(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-(--brand-primary)/50">Lower numbers appear first in the navbar</p>
                      </div>
                    )}
                  </div>

                  {/* Homepage Display Settings */}
                  <div className="space-y-3 rounded-lg border border-black/10 bg-black/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-(--brand-primary)">Show on homepage</p>
                        <p className="text-xs text-(--brand-primary)/50">Display in the homepage categories grid</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={formData.showOnHomepage}
                          onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                        />
                        <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-(--brand-primary) peer-checked:after:translate-x-full peer-checked:after:border-white" />
                      </label>
                    </div>
                    {formData.showOnHomepage && (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Grid Position</label>
                          <select
                            className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                            value={formData.homepageArea}
                            onChange={(e) => setFormData({ ...formData, homepageArea: e.target.value })}
                          >
                            <option value="">Select position...</option>
                            <option value="a">A - Large left (main feature)</option>
                            <option value="b">B - Top right</option>
                            <option value="c">C - Middle center</option>
                            <option value="d">D - Middle right</option>
                            <option value="e">E - Bottom left</option>
                            <option value="f">F - Top far right</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Subtitle</label>
                          <Input
                            placeholder="Short description for homepage"
                            value={formData.homepageSubtitle}
                            onChange={(e) => setFormData({ ...formData, homepageSubtitle: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Highlight Text</label>
                          <Input
                            placeholder="e.g., BESTSELLERS, UP TO 30% OFF"
                            value={formData.homepageHighlight}
                            onChange={(e) => setFormData({ ...formData, homepageHighlight: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Button Text</label>
                          <Input
                            placeholder="e.g., Explore, Shop Now"
                            value={formData.homepageCta}
                            onChange={(e) => setFormData({ ...formData, homepageCta: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Description</label>
                    <textarea
                      className="min-h-[100px] w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
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
              <AlertDialogTitle>Delete category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold">{selectedCategory?.name}</span>? Products in this category will need to be reassigned.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </DashboardLayout>
  );
}
