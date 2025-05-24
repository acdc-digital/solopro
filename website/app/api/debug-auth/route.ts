import { NextResponse } from "next/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export async function GET() {
  try {
    const token = await convexAuthNextjsToken();
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        message: "No auth token found" 
      });
    }
    
    // Try to get the user ID using our query
    const userId = await fetchQuery(
      api.auth.getUserId,
      {},
      { token }
    );
    
    // Also get debug info
    const debugInfo = await fetchQuery(
      api.auth.debugAuth,
      {},
      { token }
    );
    
    return NextResponse.json({
      authenticated: true,
      userId,
      debugInfo,
      tokenPresent: !!token
    });
  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json({
      authenticated: false,
      error: String(error)
    });
  }
} 