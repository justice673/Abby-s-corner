import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";

const HOMEPAGE_CATEGORIES = [
  {
    slug: "french-perfumes",
    homepageArea: "a",
    homepageSubtitle: "Elegant, balanced and sophisticated scents from the world's perfume capital.",
    homepageHighlight: "BESTSELLERS",
    homepageBullets: ["Chanel", "Dior", "Hermès", "Guerlain"],
    homepageCta: "Explore French",
  },
  {
    slug: "english-perfumes",
    homepageArea: "b",
    homepageSubtitle: "Modern, fresh fragrances with British elegance.",
    homepageCta: "Explore English",
  },
  {
    slug: "arabic-perfumes",
    homepageArea: "c",
    homepageSubtitle: "Bold, long-lasting oriental fragrances.",
    homepageHighlight: "PREMIUM OUDS",
    homepageCta: "Explore Arabic",
  },
  {
    slug: "gift-sets",
    homepageArea: "d",
    homepageSubtitle: "Curated perfume gift boxes for special occasions.",
    homepageCta: "View Sets",
  },
  {
    slug: "fragrance-bar",
    homepageArea: "e",
    homepageSubtitle: "Sample and discover new scents before you buy.",
    homepageCta: "Visit Bar",
  },
  {
    slug: "exclusive-offers",
    homepageArea: "f",
    homepageSubtitle: "Limited-time deals on premium fragrances.",
    homepageHighlight: "UP TO 30% OFF",
    homepageCta: "Shop Deals",
  },
];

export async function POST() {
  try {
    await connectToDatabase();

    // Reset all categories homepage settings
    await Category.collection.updateMany(
      {},
      {
        $set: {
          showOnHomepage: false,
          homepageArea: null,
          homepageSubtitle: null,
          homepageHighlight: null,
          homepageBullets: [],
          homepageCta: null,
        },
      }
    );

    // Set up homepage categories
    for (const cat of HOMEPAGE_CATEGORIES) {
      await Category.collection.updateOne(
        { slug: cat.slug },
        {
          $set: {
            showOnHomepage: true,
            homepageArea: cat.homepageArea,
            homepageSubtitle: cat.homepageSubtitle,
            homepageHighlight: cat.homepageHighlight || null,
            homepageBullets: cat.homepageBullets || [],
            homepageCta: cat.homepageCta,
          },
        }
      );
    }

    // Fetch the configured categories
    const configured = await Category.find({ showOnHomepage: true })
      .select("name slug homepageArea")
      .lean();

    return NextResponse.json({
      message: "Homepage categories configured",
      count: configured.length,
      categories: configured,
    });
  } catch (error) {
    console.error("Error configuring homepage categories:", error);
    return NextResponse.json(
      { error: "Failed to configure homepage categories" },
      { status: 500 }
    );
  }
}
