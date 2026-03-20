import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";

const NAV_CATEGORIES = [
  { slug: "french-perfumes", navOrder: 1 },
  { slug: "english-perfumes", navOrder: 2 },
  { slug: "arabic-perfumes", navOrder: 3 },
  { slug: "olfactory-families", navOrder: 4 },
  { slug: "fragrance-bar", navOrder: 5 },
  { slug: "abbys-box", navOrder: 6 },
  { slug: "gift-sets", navOrder: 7 },
  { slug: "exclusive-offers", navOrder: 8 },
];

export async function POST() {
  try {
    await connectToDatabase();

    const navSlugs = NAV_CATEGORIES.map((c) => c.slug);

    // Reset all categories to not show in nav using direct MongoDB update
    await Category.collection.updateMany(
      {},
      { $set: { showInNav: false, navOrder: 0 } }
    );

    // Update specific categories to show in nav
    for (const cat of NAV_CATEGORIES) {
      const result = await Category.collection.updateOne(
        { slug: cat.slug },
        { $set: { showInNav: true, navOrder: cat.navOrder } }
      );
      console.log(`Updated ${cat.slug}:`, result.modifiedCount);
    }

    // Create any missing nav categories
    const missingCategories = [
      {
        name: "Olfactory families",
        slug: "olfactory-families",
        type: "secondary",
        description: "Browse perfumes by scent family - woody, floral, oriental, fresh and more.",
        isActive: true,
        showInNav: true,
        navOrder: 4,
        sortOrder: 0,
      },
      {
        name: "Fragrance bar",
        slug: "fragrance-bar",
        type: "secondary",
        description: "Sample and discover new scents at our fragrance bar.",
        isActive: true,
        showInNav: true,
        navOrder: 5,
        sortOrder: 0,
      },
      {
        name: "Abby's Box",
        slug: "abbys-box",
        type: "secondary",
        description: "Curated monthly perfume discovery boxes.",
        isActive: true,
        showInNav: true,
        navOrder: 6,
        sortOrder: 0,
      },
      {
        name: "Exclusive Offers",
        slug: "exclusive-offers",
        type: "utility",
        description: "Special deals and limited-time offers.",
        isActive: true,
        showInNav: true,
        navOrder: 8,
        sortOrder: 0,
      },
    ];

    for (const cat of missingCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
      } else {
        // Update existing with nav fields
        await Category.collection.updateOne(
          { slug: cat.slug },
          { $set: { showInNav: true, navOrder: cat.navOrder } }
        );
      }
    }

    // Fetch all nav categories
    const navCategories = await Category.collection
      .find({ showInNav: true })
      .sort({ navOrder: 1 })
      .toArray();

    return NextResponse.json({
      message: "Nav categories updated",
      count: navCategories.length,
      categories: navCategories.map((c) => ({
        name: c.name,
        slug: c.slug,
        navOrder: c.navOrder,
        showInNav: c.showInNav,
      })),
    });
  } catch (error) {
    console.error("Error updating nav categories:", error);
    return NextResponse.json(
      { error: "Failed to update nav categories" },
      { status: 500 }
    );
  }
}
