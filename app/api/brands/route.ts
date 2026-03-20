import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";

export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find({ isActive: true })
      .select("brand image")
      .lean();

    const brandMap = new Map<
      string,
      {
        label: string;
        image: string;
      }
    >();

    for (const p of products) {
      if (!p.brand) continue;
      if (!brandMap.has(p.brand)) {
        brandMap.set(p.brand, {
          label: p.brand,
          image: p.image || "/images/product-1.jpg",
        });
      }
    }

    const items = Array.from(brandMap.values()).map((b, index) => {
      const id = b.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return {
        id,
        label: b.label,
        description: `Discover our selection of ${b.label} perfumes.`,
        image: b.image,
        buttonText: `Shop ${b.label}`,
        link: `/shop?brand=${encodeURIComponent(b.label)}`,
        order: index,
      };
    });

    // Sort alphabetically by label
    items.sort((a, b) => a.label.localeCompare(b.label));

    // Add synthetic "All brands" item at the top if we have at least one brand
    if (items.length > 0) {
      const firstImage = items[0].image;
      items.unshift({
        id: "all-brands",
        label: "All brands",
        description:
          "Explore our full range of perfume houses, from the most iconic to new confidential signatures.",
        image: firstImage,
        buttonText: "Discover all brands",
        link: "/shop",
        order: -1,
      });
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

