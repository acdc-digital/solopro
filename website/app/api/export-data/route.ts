import { NextResponse } from "next/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export async function POST() {
  try {
    // Get the auth token
    const token = await convexAuthNextjsToken();
    
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch user data from Convex using the export function
    const userData = await fetchQuery(
      api.users.exportUserData,
      {},
      { token }
    );

    const payload = {
      ...userData,
      metadata: {
        version: "1.0",
        exportType: "full",
        exportedBy: "Soloist Pro",
      }
    };

    // Create response with proper headers
    const response = new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=soloist-export-${Date.now()}.json`,
      },
    });

    return response;
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
} 