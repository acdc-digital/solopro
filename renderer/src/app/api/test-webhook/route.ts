import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Test webhook endpoint called");
    
    const body = await request.json();
    console.log("Test webhook body:", body);
    
    return NextResponse.json({ 
      success: true, 
      message: "Test webhook received",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Test webhook error:", error);
    return NextResponse.json(
      { error: "Test webhook failed" },
      { status: 500 }
    );
  }
}
