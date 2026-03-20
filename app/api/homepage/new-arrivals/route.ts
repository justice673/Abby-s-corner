import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "8");

    await connectToDatabase();

    // Fetch newest active products, sorted by createdAt (newest first)
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("name fullName brand price image volume createdAt")
      .lean();

    // Format the products for the frontend
    const formattedProducts = products.map((product) => ({
      name: product.name,
      description: `${product.brand} - ${product.volume || ""}`.trim(),
      price: new Intl.NumberFormat("fr-CM", {
        style: "currency",
        currency: "XAF",
        minimumFractionDigits: 0,
      }).format(product.price),
      image: product.image || "/images/product-1.jpg",
      link: `/product/${product._id}`,
    }));

    return NextResponse.json({ arrivals: formattedProducts });
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return NextResponse.json(
      { error: "Failed to fetch new arrivals" },
      { status: 500 }
    );
  }
}
