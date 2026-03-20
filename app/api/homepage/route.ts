import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import HomeSection from "@/lib/db/models/HomeSection";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const sectionType = searchParams.get("type");
    const sectionId = searchParams.get("id");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { isActive: true };

    if (sectionType) {
      query.sectionType = sectionType;
    }

    if (sectionId) {
      // For perfume_style sections, we store the style id in data.id
      query["data.id"] = sectionId;
    }

    const sections = await HomeSection.find(query)
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ sections });
  } catch (error) {
    console.error("Error fetching homepage sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage sections" },
      { status: 500 }
    );
  }
}
