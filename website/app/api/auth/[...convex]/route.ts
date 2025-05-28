import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // For now, return a basic response until we can properly integrate Convex Auth
  return NextResponse.json({ error: "Auth endpoint not fully configured yet" }, { status: 501 });
}

export async function POST(request: NextRequest) {
  // For now, return a basic response until we can properly integrate Convex Auth
  return NextResponse.json({ error: "Auth endpoint not fully configured yet" }, { status: 501 });
} 