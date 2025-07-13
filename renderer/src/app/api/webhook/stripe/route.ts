import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Initialize Stripe with your secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

console.log("Stripe webhook config:", {
  hasSecretKey: !!stripeSecretKey,
  hasWebhookSecret: !!webhookSecret,
  convexUrl
});

if (!stripeSecretKey) {
  console.error("Missing STRIPE_SECRET_KEY environment variable");
}

if (!webhookSecret) {
  console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
}

if (!convexUrl) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil" as any,
});

// Initialize Convex client
const convex = new ConvexHttpClient(convexUrl || "");

export async function POST(request: Request) {
  try {
    console.log("Webhook request received");
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    console.log("Webhook signature:", !!signature);

    if (!signature) {
      console.error("Missing Stripe signature");
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error("Webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      console.log("Verifying webhook signature");
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("Signature verified successfully");
    } catch (err) {
      console.error("Invalid webhook signature:", err);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err}` },
        { status: 400 }
      );
    }

    console.log(`Received Stripe webhook event: ${event.type}`);

    // Process the webhook event using our Convex function
    const eventData = event.data.object;
    try {
      console.log("Calling Convex processStripeWebhook function");
      const result = await convex.mutation(api.webhooks.processStripeWebhook, {
        eventType: event.type,
        data: eventData
      });
      
      console.log("Webhook processing result:", result);
      
      return NextResponse.json({ received: true, result });
    } catch (error) {
      console.error("Error calling Convex function:", error);
      return NextResponse.json(
        { error: "Error processing webhook in Convex", details: String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the webhook" },
      { status: 500 }
    );
  }
}
