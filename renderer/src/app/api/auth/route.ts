import { NextRequest, NextResponse } from "next/server";

// Simple auth route that works with Convex Auth middleware
export async function GET(request: NextRequest) {
  // The actual auth handling is done by the middleware and Convex Auth system
  // This route exists to satisfy the API endpoint requirement
  return NextResponse.json({ message: "Auth endpoint active" });
}

export async function POST(request: NextRequest) {
  // The actual auth handling is done by the middleware and Convex Auth system
  // This route exists to satisfy the API endpoint requirement
  return NextResponse.json({ message: "Auth endpoint active" });
} 