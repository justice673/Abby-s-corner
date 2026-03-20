import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

// GET - Check if setup is needed
export async function GET() {
  try {
    await connectToDatabase();
    
    const adminExists = await User.findOne({ role: "admin" });
    
    return NextResponse.json({
      setupRequired: !adminExists,
      message: adminExists
        ? "Admin account already exists"
        : "No admin account found. Setup required.",
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 }
    );
  }
}

// POST - Create initial admin user
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin account already exists. Please log in." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Create admin user
    const user = new User({
      name,
      email,
      password,
      role: "admin",
      isActive: true,
    });

    await user.save();

    return NextResponse.json({
      message: "Admin account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    
    // Handle duplicate email error
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create admin account" },
      { status: 500 }
    );
  }
}
