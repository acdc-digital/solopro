import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Return success response with Set-Cookie header
    return NextResponse.json(
      { success: true },
      { 
        status: 200,
        headers: {
          // Set cookie for user ID
          "Set-Cookie": `convex-userId=${userId}; Path=/; SameSite=Strict; HttpOnly; Max-Age=31536000`
        }
      }
    );
  } catch (error) {
    console.error("Error storing user ID:", error);
    return NextResponse.json(
      { error: "An error occurred while storing user ID" },
      { status: 500 }
    );
  }
} 