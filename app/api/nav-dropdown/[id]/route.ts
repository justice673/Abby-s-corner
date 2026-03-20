import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import NavDropdown from "@/lib/db/models/NavDropdown";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const dropdown = await NavDropdown.findById(id).lean();

    if (!dropdown) {
      return NextResponse.json(
        { error: "Dropdown not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ dropdown });
  } catch (error) {
    console.error("Error fetching dropdown:", error);
    return NextResponse.json(
      { error: "Failed to fetch dropdown" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const dropdown = await NavDropdown.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!dropdown) {
      return NextResponse.json(
        { error: "Dropdown not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ dropdown });
  } catch (error) {
    console.error("Error updating dropdown:", error);
    return NextResponse.json(
      { error: "Failed to update dropdown" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const dropdown = await NavDropdown.findByIdAndDelete(id);

    if (!dropdown) {
      return NextResponse.json(
        { error: "Dropdown not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Dropdown deleted successfully" });
  } catch (error) {
    console.error("Error deleting dropdown:", error);
    return NextResponse.json(
      { error: "Failed to delete dropdown" },
      { status: 500 }
    );
  }
}
