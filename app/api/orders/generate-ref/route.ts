import { NextRequest, NextResponse } from "next/server";

// Generate a unique order reference without database
// Format: ABY-YYYYMMDD-XXXX (where XXXX is random)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, total } = body;

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const orderRef = `ABY-${year}${month}${day}-${random}`;

    // Store in localStorage-compatible format for display
    // The actual order will be created when admin logs it
    return NextResponse.json({
      orderRef,
      generatedAt: date.toISOString(),
      summary: {
        itemCount: items?.length || 0,
        customerName: customer?.name || "",
        total: total || 0,
      },
    });
  } catch (error) {
    console.error("Error generating order reference:", error);
    return NextResponse.json(
      { error: "Failed to generate order reference" },
      { status: 500 }
    );
  }
}
