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

export async function POST(request: Request) {
  try {
    console.log("API: create-checkout-session called");
    
    const body = await request.json();
    const { priceId, paymentMode = "payment", embeddedCheckout = true, userId } = body;

    console.log("Received request with priceId:", priceId, "mode:", paymentMode, "embedded:", embeddedCheckout, "userId:", userId);

    if (!priceId) {
      console.error("API Error: Price ID is required but was not provided");
      return NextResponse.json(
        { error: "Price ID is required" },
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

    if (!userId) {
      console.error("API Error: User ID is required but was not provided");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log(`Creating Stripe checkout session for price ID: ${priceId} and user ID: ${userId}`);
    
    // Get the origin for redirect URLs
    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    console.log("Using origin for redirects:", origin);

    // Common session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: paymentMode as "payment" | "subscription",
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: {
        enabled: true,
      },
      // Add client_reference_id to identify the user
      client_reference_id: userId,
      // Add metadata for additional information
      metadata: {
        userId,
      },
    };

    if (embeddedCheckout) {
      // For embedded checkout, we use ui_mode: 'embedded' and return_url
      sessionParams.ui_mode = 'embedded';
      sessionParams.return_url = `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
      // Set redirect_on_completion to 'if_required' to allow onComplete callback to be called
      sessionParams.redirect_on_completion = 'if_required';
    } else {
      // For redirect checkout, we use success_url and cancel_url
      sessionParams.success_url = `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`;
      sessionParams.cancel_url = `${origin}/?canceled=true`;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("Checkout session created successfully:", session.id);

    if (embeddedCheckout) {
      console.log("Returning client secret for embedded checkout");
      return NextResponse.json({ 
        clientSecret: session.client_secret,
        sessionId: session.id
      });
    } else {
      // Return the URL for redirect
      if (!session.url) {
        throw new Error("Failed to generate checkout URL");
      }
      
      console.log("Checkout URL created:", session.url);
      return NextResponse.json({ url: session.url });
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    
    // Extract more details from the Stripe error if available
    let errorMessage = "Failed to create checkout session";
    
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