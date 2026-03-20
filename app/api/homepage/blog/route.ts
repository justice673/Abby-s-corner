import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import BlogPost from "@/lib/db/models/BlogPost";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");

    await connectToDatabase();

    // Fetch published blog posts, sorted by publishedAt (newest first)
    const posts = await BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .select("title slug excerpt coverImage category tags publishedAt views readTime")
      .lean();

    // Format the posts for the frontend
    const formattedPosts = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      tag: post.category,
      date: post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "",
      image: post.coverImage || "/images/product-1.jpg",
      comments: 0, // Could be added later with a comments system
      views: post.views,
      readTime: post.readTime,
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
