import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Check if we have a Stripe key
if (!stripeSecretKey) {
  console.error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function GET(request: Request) {
  try {
    console.log("API: get-checkout-session called");
    
    // Get the session ID from the query string
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');

    console.log("Received request for session ID:", sessionId);

    if (!sessionId) {
      console.error("API Error: Session ID is required but was not provided");
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!stripeSecretKey) {
      console.error("API Error: Stripe secret key is not configured");
      return NextResponse.json(
        { error: "Payment service is not properly configured" },
        { status: 500 }
      );
    }

    console.log(`Retrieving Stripe checkout session with ID: ${sessionId}`);
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'subscription']
    });

    console.log("Checkout session retrieved successfully:", session.id);
    
    // Return relevant session information
    return NextResponse.json({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_email,
      customerDetails: session.customer_details,
      amountTotal: session.amount_total,
      currency: session.currency,
      paymentIntent: session.payment_intent,
      subscription: session.subscription
    });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    
    // Extract more details from the Stripe error if available
    let errorMessage = "Failed to retrieve checkout session";
    
    if (error instanceof Stripe.errors.StripeError) {
      errorMessage = `Stripe error: ${error.type} - ${error.message}`;
      console.error("Stripe error details:", {
        type: error.type,
        code: error.code,
        param: error.param
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 