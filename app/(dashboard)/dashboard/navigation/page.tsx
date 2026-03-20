"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  Pencil,
  Trash2,
  Loader2,
  GripVertical,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";

interface DropdownItem {
  id: string;
  label: string;
  description: string;
  image: string;
  buttonText: string;
  link?: string;
  order: number;
}

interface NavDropdown {
  _id: string;
  menuKey: "marques" | "maison";
  menuLabel: string;
  items: DropdownItem[];
  isActive: boolean;
}

export default function NavigationPage() {
  const [dropdowns, setDropdowns] = useState<NavDropdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingDropdown, setEditingDropdown] = useState<NavDropdown | null>(null);
  const [editingItem, setEditingItem] = useState<DropdownItem | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number>(-1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ dropdownId: string; itemIndex: number } | null>(null);

  const [itemForm, setItemForm] = useState({
    id: "",
    label: "",
    description: "",
    image: "",
    buttonText: "",
    link: "",
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "abbys-corner/navigation");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setItemForm({ ...itemForm, image: data.url });
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const fetchDropdowns = useCallback(async () => {
    try {
      const res = await fetch("/api/nav-dropdown");
      if (res.ok) {
        const data = await res.json();
        setDropdowns(data.dropdowns || []);
      }
    } catch (error) {
      console.error("Failed to fetch dropdowns:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDropdowns();
  }, [fetchDropdowns]);

  const openAddItem = (dropdown: NavDropdown) => {
    setEditingDropdown(dropdown);
    setEditingItem(null);
    setEditingItemIndex(-1);
    setItemForm({
      id: "",
      label: "",
      description: "",
      image: "",
      buttonText: "",
      link: "",
    });
    setIsSheetOpen(true);
  };

  const openEditItem = (dropdown: NavDropdown, item: DropdownItem, index: number) => {
    setEditingDropdown(dropdown);
    setEditingItem(item);
    setEditingItemIndex(index);
    setItemForm({
      id: item.id,
      label: item.label,
      description: item.description,
      image: item.image,
      buttonText: item.buttonText,
      link: item.link || "",
    });
    setIsSheetOpen(true);
  };

  const handleSaveItem = async () => {
    if (!editingDropdown) return;

    setSaving(true);
    try {
      const newItem: DropdownItem = {
        id: itemForm.id || itemForm.label.toLowerCase().replace(/\s+/g, "-"),
        label: itemForm.label,
        description: itemForm.description,
        image: itemForm.image,
        buttonText: itemForm.buttonText,
        link: itemForm.link,
        order: editingItemIndex >= 0 ? editingItemIndex : editingDropdown.items.length,
      };

      let updatedItems: DropdownItem[];
      if (editingItemIndex >= 0) {
        updatedItems = [...editingDropdown.items];
        updatedItems[editingItemIndex] = newItem;
      } else {
        updatedItems = [...editingDropdown.items, newItem];
      }

      const res = await fetch(`/api/nav-dropdown/${editingDropdown._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (res.ok) {
        await fetchDropdowns();
        setIsSheetOpen(false);
      }
    } catch (error) {
      console.error("Failed to save item:", error);
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteItem = (dropdownId: string, itemIndex: number) => {
    setItemToDelete({ dropdownId, itemIndex });
    setDeleteDialogOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    setSaving(true);
    try {
      const dropdown = dropdowns.find((d) => d._id === itemToDelete.dropdownId);
      if (!dropdown) return;

      const updatedItems = dropdown.items.filter((_, i) => i !== itemToDelete.itemIndex);

      const res = await fetch(`/api/nav-dropdown/${dropdown._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (res.ok) {
        await fetchDropdowns();
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setSaving(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--brand-primary)">Navigation Menus</h1>
          <p className="mt-1 text-sm text-(--brand-primary)/70">
            Manage the dropdown menus in your navigation bar
          </p>
        </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {dropdowns.map((dropdown) => (
          <Card key={dropdown._id} className="border-black/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg text-(--brand-primary)">
                  {dropdown.menuLabel}
                </CardTitle>
                <CardDescription>
                  {dropdown.items.length} items · Key: {dropdown.menuKey}
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => openAddItem(dropdown)}
                className="bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {dropdown.items.length === 0 ? (
                <p className="text-sm text-(--brand-primary)/50 text-center py-8">
                  No items yet. Add your first item.
                </p>
              ) : (
                <div className="space-y-3">
                  {dropdown.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-3"
                    >
                      <GripVertical className="h-4 w-4 text-(--brand-primary)/30 cursor-grab" />
                      <div className="h-12 w-12 rounded-lg bg-black/5 overflow-hidden shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.label}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-(--brand-primary)/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-(--brand-primary) truncate">
                          {item.label}
                        </p>
                        <p className="text-xs text-(--brand-primary)/60 truncate">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditItem(dropdown, item, index)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDeleteItem(dropdown._id, index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {dropdowns.length === 0 && (
        <Card className="border-black/10">
          <CardContent className="py-12 text-center">
            <p className="text-(--brand-primary)/60 mb-4">
              No navigation menus found. Seed the database to get started.
            </p>
            <Button
              onClick={async () => {
                setLoading(true);
                await fetch("/api/nav-dropdown/seed", { method: "POST" });
                await fetchDropdowns();
              }}
              className="bg-(--brand-primary) text-white"
            >
              Seed Navigation Menus
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit/Add Item Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="flex flex-col overflow-hidden" side="right">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle className="text-(--brand-primary)">
              {editingItem ? "Edit Item" : "Add New Item"}
            </SheetTitle>
            <SheetDescription>
              {editingDropdown?.menuLabel} dropdown menu
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                  Label *
                </label>
                <Input
                  value={itemForm.label}
                  onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
                  placeholder="e.g., All brands"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                  Description *
                </label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="A brief description of this item..."
                  className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black min-h-[80px] outline-none focus:border-black/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                  Image *
                </label>
                
                {/* Image Preview or Upload Area */}
                {itemForm.image ? (
                  <div className="relative">
                    <div className="h-32 w-full rounded-xl overflow-hidden bg-black/5 border border-black/10">
                      <img
                        src={itemForm.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/product-1.jpg";
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setItemForm({ ...itemForm, image: "" })}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-black/20 bg-black/[0.02] px-4 py-8 transition hover:border-black/40 hover:bg-black/[0.04]">
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
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--brand-primary)/10">
                          <Upload className="h-6 w-6 text-(--brand-primary)" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-(--brand-primary)">
                          Click to upload image
                        </p>
                        <p className="mt-1 text-xs text-(--brand-primary)/50">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </>
                    )}
                  </label>
                )}

                {/* Or enter URL manually */}
                <div className="relative mt-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-(--brand-primary)/40">or enter URL</span>
                  </div>
                </div>
                <Input
                  value={itemForm.image}
                  onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="mt-2"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                  Button Text *
                </label>
                <Input
                  value={itemForm.buttonText}
                  onChange={(e) => setItemForm({ ...itemForm, buttonText: e.target.value })}
                  placeholder="e.g., Discover all brands"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                  Link (optional)
                </label>
                <Input
                  value={itemForm.link}
                  onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })}
                  placeholder="/brands"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 px-6 py-4">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsSheetOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveItem}
                disabled={saving || !itemForm.label || !itemForm.description || !itemForm.image || !itemForm.buttonText}
                className="flex-1 bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingItem ? (
                  "Update Item"
                ) : (
                  "Add Item"
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </section>
    </DashboardLayout>
  );
}
