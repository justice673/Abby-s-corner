import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import NavDropdown from "@/lib/db/models/NavDropdown";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const menuKey = searchParams.get("key");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { isActive: true };

    if (menuKey) {
      query.menuKey = menuKey;
    }

    const dropdowns = await NavDropdown.find(query).lean();

    return NextResponse.json({ dropdowns });
  } catch (error) {
    console.error("Error fetching nav dropdowns:", error);
    return NextResponse.json(
      { error: "Failed to fetch nav dropdowns" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { menuKey, menuLabel, items } = body;

    if (!menuKey || !menuLabel) {
      return NextResponse.json(
        { error: "Menu key and label are required" },
        { status: 400 }
      );
    }

    const dropdown = await NavDropdown.findOneAndUpdate(
      { menuKey },
      { menuKey, menuLabel, items, isActive: true },
      { upsert: true, new: true }
    );

    return NextResponse.json({ dropdown });
  } catch (error) {
    console.error("Error creating nav dropdown:", error);
    return NextResponse.json(
      { error: "Failed to create nav dropdown" },
      { status: 500 }
    );
  }
}
