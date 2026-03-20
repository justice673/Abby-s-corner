import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await Category.find({
      isActive: true,
      showInNav: true,
    })
      .sort({ navOrder: 1 })
      .select("name slug")
      .lean();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching nav categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch nav categories" },
      { status: 500 }
    );
  }
}
