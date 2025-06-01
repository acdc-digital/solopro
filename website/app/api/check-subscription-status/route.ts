import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // If session has subscription, retrieve it
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      
      return NextResponse.json({
        status: subscription.status,
        customerId: subscription.customer,
        priceId: subscription.items.data[0].price.id,
        productId: subscription.items.data[0].price.product,
        current_period_end: (subscription as any).current_period_end,
        cancel_at_period_end: (subscription as any).cancel_at_period_end,
      });
    }

    return NextResponse.json({ status: "no_subscription" });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to check subscription status";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 