import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import Category from "@/lib/db/models/Category";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const limit = parseInt(searchParams.get("limit") || "6");

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [], categories: [] });
    }

    await connectToDatabase();

    // Create a case-insensitive regex for matching
    const searchRegex = new RegExp(query, "i");

    // Search products by name, brand, or tags
    const products = await Product.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { fullName: searchRegex },
        { brand: searchRegex },
        { tags: searchRegex },
        { description: searchRegex },
      ],
    })
      .select("name fullName brand image price slug tags")
      .limit(limit)
      .lean();

    // Search categories
    const categories = await Category.find({
      isActive: true,
      $or: [{ name: searchRegex }, { description: searchRegex }],
    })
      .select("name slug image")
      .limit(3)
      .lean();

    return NextResponse.json({
      products,
      categories,
      query,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
