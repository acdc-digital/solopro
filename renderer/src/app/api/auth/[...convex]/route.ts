import { NextRequest, NextResponse } from "next/server";

// Handle all Convex Auth routes
export async function GET(request: NextRequest) {
  // Let the middleware handle auth routing
  return NextResponse.json({ message: "Auth routing handled by middleware" });
}

export async function POST(request: NextRequest) {
  // Let the middleware handle auth routing  
  return NextResponse.json({ message: "Auth routing handled by middleware" });
} 