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
import { Loader2, FileText, Send, Clock, Eye, Upload, X } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "scheduled" | "published";
  category: string;
  excerpt?: string;
  content: string;
  author: string;
  coverImage?: string;
  readTime: number;
  views: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

const CATEGORIES = [
  "French perfumes",
  "English perfumes",
  "Arabic perfumes",
  "Fragrance bar",
  "Tips & Guides",
];

const defaultFormData: {
  title: string;
  slug: string;
  status: "draft" | "scheduled" | "published";
  category: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
} = {
  title: "",
  slug: "",
  status: "draft",
  category: "French perfumes",
  excerpt: "",
  content: "",
  author: "Abby",
  coverImage: "/images/product-1.jpg",
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

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
      formDataUpload.append("folder", "abbys-corner/blog");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, coverImage: data.url }));
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const resetForm = () => {
    setFormData(defaultFormData);
    setTags([]);
    setTagInput("");
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleView = (post: BlogPost) => {
    setSelectedPost(post);
    setViewOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      status: post.status,
      category: post.category,
      excerpt: post.excerpt || "",
      content: post.content,
      author: post.author,
      coverImage: post.coverImage || "/images/product-1.jpg",
    });
    setTags(post.tags || []);
    setEditOpen(true);
  };

  const handleDelete = (post: BlogPost) => {
    setSelectedPost(post);
    setDeleteOpen(true);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      setSaving(true);
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        status: formData.status,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        coverImage: formData.coverImage,
        tags,
      };

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        setAddOpen(false);
        resetForm();
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    try {
      setSaving(true);
      const postData = {
        title: formData.title,
        slug: formData.slug,
        status: formData.status,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        coverImage: formData.coverImage,
        tags,
      };

      const res = await fetch(`/api/blog/${selectedPost._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        setEditOpen(false);
        resetForm();
        setSelectedPost(null);
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;

    try {
      const res = await fetch(`/api/blog/${selectedPost._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteOpen(false);
        setSelectedPost(null);
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate stats
  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    drafts: posts.filter((p) => p.status === "draft").length,
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
  };

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-(--brand-primary)">Blog</h1>
            <p className="mt-1 text-sm text-(--brand-primary)/70">
              Plan and manage editorial content for Abby&apos;s Corner.
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
            New post
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--brand-primary)/10">
                <FileText className="h-6 w-6 text-(--brand-primary)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.total}</p>
                <p className="text-sm text-(--brand-primary)/60">Total Posts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <Send className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.published}</p>
                <p className="text-sm text-(--brand-primary)/60">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.drafts}</p>
                <p className="text-sm text-(--brand-primary)/60">Drafts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--brand-primary)">{stats.totalViews}</p>
                <p className="text-sm text-(--brand-primary)/60">Total Views</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent posts</CardTitle>
            <CardDescription>Drafts, scheduled and published perfume articles.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40" />
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-(--brand-primary)/20" />
                <h3 className="mt-4 text-lg font-medium text-(--brand-primary)">No posts yet</h3>
                <p className="mt-1 text-sm text-(--brand-primary)/60">
                  Create your first blog post
                </p>
                <Button
                  onClick={() => {
                    resetForm();
                    setAddOpen(true);
                  }}
                  className="mt-4 bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
                >
                  <RiAddCircleLine className="mr-2 h-4 w-4" />
                  New post
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b text-xs uppercase text-(--brand-primary)/60">
                    <tr>
                      <th className="py-2 pr-3 font-medium">Post</th>
                      <th className="py-2 px-3 font-medium">Category</th>
                      <th className="py-2 px-3 font-medium">Status</th>
                      <th className="py-2 px-3 font-medium">Views</th>
                      <th className="py-2 pl-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post._id} className="border-b last:border-0">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/5">
                              <img
                                src={post.coverImage || "/images/product-1.jpg"}
                                alt={post.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-(--brand-primary)">{post.title}</span>
                              <span className="text-xs text-(--brand-primary)/50">
                                {post.readTime} min read · {formatDate(post.createdAt)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs text-(--brand-primary)/55">{post.category}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(post.status)}`}>
                            {getStatusLabel(post.status)}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-sm text-(--brand-primary)">{post.views}</span>
                        </td>
                        <td className="py-3 pl-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(post)}>
                              <RiEyeLine className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(post)}>
                              <RiEdit2Line className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(post)}>
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

        {/* Add Post Sheet */}
        <Sheet open={addOpen} onOpenChange={setAddOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>New blog post</SheetTitle>
              <SheetDescription>Draft a new article about perfumes.</SheetDescription>
            </SheetHeader>
            <form className="flex min-h-0 flex-1 flex-col text-sm text-(--brand-primary)" onSubmit={handleCreatePost}>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                    Cover image
                  </label>
                  {formData.coverImage ? (
                    <div className="relative overflow-hidden rounded-xl border border-black/10 bg-black/5">
                      <img
                        src={formData.coverImage}
                        alt={formData.title || "Blog cover image"}
                        className="h-40 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, coverImage: "" })}
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
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Title *</label>
                  <Input
                    placeholder="How to find your French signature scent"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Slug</label>
                  <Input
                    placeholder="how-to-find-french-signature-scent"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Category</label>
                    <select
                      className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Status</label>
                    <select
                      className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "scheduled" | "published" })}
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Author</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Excerpt</label>
                  <textarea
                    className="min-h-[80px] w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none"
                    placeholder="Write a short teaser…"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Content *</label>
                  <textarea
                    className="min-h-[150px] w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none"
                    placeholder="Write your blog post content here…"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
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
                      className="h-9 flex-1 min-w-[140px]"
                    />
                    <Button type="button" size="sm" variant="outline" onClick={handleAddTag}>Add</Button>
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
              </div>
              <SheetFooter className="border-t border-black/10 p-4">
                <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save post
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* View Post Sheet */}
        <Sheet open={viewOpen} onOpenChange={setViewOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Post details</SheetTitle>
              <SheetDescription>Preview your blog post.</SheetDescription>
            </SheetHeader>
            {selectedPost && (
              <div className="flex min-h-0 flex-1 flex-col text-sm text-(--brand-primary)">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-black/10 bg-black/5">
                    <img src={selectedPost.coverImage || "/images/product-1.jpg"} alt={selectedPost.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(selectedPost.status)}`}>
                        {getStatusLabel(selectedPost.status)}
                      </span>
                      <span className="text-xs text-(--brand-primary)/50">{selectedPost.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{selectedPost.title}</h3>
                    <p className="text-xs text-(--brand-primary)/50">/{selectedPost.slug}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-(--brand-primary)/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-(--brand-primary)/50">Author</p>
                      <p className="mt-0.5 font-medium">{selectedPost.author}</p>
                    </div>
                    <div className="rounded-lg bg-(--brand-primary)/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-(--brand-primary)/50">Read time</p>
                      <p className="mt-0.5 font-medium">{selectedPost.readTime} min</p>
                    </div>
                    <div className="rounded-lg bg-(--brand-primary)/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-(--brand-primary)/50">Views</p>
                      <p className="mt-0.5 font-medium">{selectedPost.views}</p>
                    </div>
                  </div>
                  {selectedPost.excerpt && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.15em] text-(--brand-primary)/50">Excerpt</p>
                      <p className="text-sm italic leading-relaxed text-(--brand-primary)/80">"{selectedPost.excerpt}"</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.15em] text-(--brand-primary)/50">Content</p>
                    <p className="text-sm leading-relaxed text-(--brand-primary)/80">{selectedPost.content}</p>
                  </div>
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.15em] text-(--brand-primary)/50">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPost.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-(--brand-primary)/5 px-3 py-1 text-xs font-medium">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <SheetFooter className="border-t border-black/10 p-4">
                  <Button type="button" variant="ghost" onClick={() => setViewOpen(false)}>Close</Button>
                  <Button
                    type="button"
                    className="bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90"
                    onClick={() => { setViewOpen(false); handleEdit(selectedPost); }}
                  >
                    Edit post
                  </Button>
                </SheetFooter>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Edit Post Sheet */}
        <Sheet open={editOpen} onOpenChange={setEditOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit post</SheetTitle>
              <SheetDescription>Update the blog post.</SheetDescription>
            </SheetHeader>
            {selectedPost && (
              <form className="flex min-h-0 flex-1 flex-col text-sm text-(--brand-primary)" onSubmit={handleUpdatePost}>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">
                      Cover image
                    </label>
                    {formData.coverImage ? (
                      <div className="relative overflow-hidden rounded-xl border border-black/10 bg-black/5">
                        <img
                          src={formData.coverImage}
                          alt={formData.title || "Blog cover image"}
                          className="h-40 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, coverImage: "" })}
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
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Title</label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Slug</label>
                    <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Category</label>
                      <select className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        {CATEGORIES.map((cat) => (<option key={cat}>{cat}</option>))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Status</label>
                      <select className="h-9 w-full rounded-md border border-black/15 bg-white px-3 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "scheduled" | "published" })}>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Author</label>
                    <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Excerpt</label>
                    <textarea className="min-h-[80px] w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Content</label>
                    <textarea className="min-h-[150px] w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.15em] text-(--brand-primary)/70">Tags</label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Input placeholder="Add a tag…" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }} className="h-9 flex-1 min-w-[140px]" />
                      <Button type="button" size="sm" variant="outline" onClick={handleAddTag}>Add</Button>
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
              <AlertDialogTitle>Delete post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold">"{selectedPost?.title}"</span>? This action cannot be undone.
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
