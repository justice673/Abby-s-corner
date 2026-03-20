import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch categories marked for homepage display
    const categories = await Category.find({
      isActive: true,
      showOnHomepage: true,
      homepageArea: { $ne: null },
    })
      .sort({ homepageArea: 1 })
      .select(
        "name slug description image homepageArea homepageSubtitle homepageHighlight homepageBullets homepageCta"
      )
      .lean();

    // Format categories for the homepage grid
    const formattedCategories = categories.map((cat) => ({
      label: cat.name,
      href: `/shop?category=${cat.slug}`,
      area: cat.homepageArea || "a",
      image: cat.image || "/images/product-1.jpg",
      subtitle: cat.homepageSubtitle || cat.description || "",
      highlightLine: cat.homepageHighlight,
      bullets: cat.homepageBullets || [],
      ctaLabel: cat.homepageCta || "Discover",
    }));

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error("Error fetching homepage categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
