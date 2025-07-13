import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

const http = httpRouter();

auth.addHttpRoutes(http);

// Add route for checking payment status
http.route({
  path: "/api/check-payment-status",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers });
    }

    try {
      const url = new URL(request.url);
      const sessionId = url.searchParams.get('session_id');

      if (!sessionId) {
        return new Response(
          JSON.stringify({ error: "session_id parameter required" }),
          { status: 400, headers }
        );
      }

      // Check if payment exists and is completed
      const payment = await ctx.runQuery(internal.payments.getBySessionId, {
        sessionId,
      });

      const completed = payment && (payment.status === 'completed' || payment.status === 'succeeded');

      return new Response(
        JSON.stringify({ completed, payment }),
        { status: 200, headers }
      );
    } catch (error) {
      console.error("Error checking payment status:", error);
      return new Response(
        JSON.stringify({ error: "Failed to check payment status" }),
        { status: 500, headers }
      );
    }
  }),
});

// Add route for creating Stripe checkout sessions
http.route({
  path: "/api/create-checkout-session",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers });
    }

    try {
      const body = await request.json();
      const { priceId, userId: providedUserId, convexUserId: providedConvexUserId } = body;

      // Get the authenticated user - either from auth context or from request body (for internal calls)
      let authUserId = providedUserId;
      let userDocumentId = providedConvexUserId;
      
      if (!authUserId || !userDocumentId) {
        const userIdentity = await ctx.auth.getUserIdentity();
        if (!userIdentity) {
          return new Response(
            JSON.stringify({ error: "Authentication required" }),
            { status: 401, headers }
          );
        }
        authUserId = userIdentity.subject;
        
        // Get the Convex user ID
        const existingUser = await ctx.runQuery(internal.users.getUserByAuthId, {
          authId: authUserId
        });

        if (!existingUser) {
          return new Response(
            JSON.stringify({ error: "User not found. Please log in again." }),
            { status: 404, headers }
          );
        }
        
        userDocumentId = existingUser._id;
      }

      // Initialize Stripe
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-04-30.basil",
      });

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        client_reference_id: authUserId, // This is what the webhook handler expects
        metadata: {
          userId: authUserId,
        },
        ui_mode: "embedded",
        // Disable redirects - we handle completion via events in the modal
        redirect_on_completion: "never",
      });

      // Create initial payment record
      await ctx.runMutation(internal.payments.create, {
        userId: userDocumentId,
        stripeSessionId: session.id,
        priceId,
        status: "pending",
        productName: "Pro Plan",
        paymentMode: "subscription",
        createdAt: Date.now()
      });

      return new Response(
        JSON.stringify({
          clientSecret: session.client_secret,
          sessionId: session.id
        }),
        { status: 200, headers }
      );
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Failed to create checkout session"
        }),
        { status: 500, headers }
      );
    }
  })
});

// Add route for Stripe webhooks
http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Get the Stripe signature from the headers
    const signature = request.headers.get("stripe-signature");
    
    if (!signature) {
      return new Response("Webhook Error: No signature provided", { status: 400 });
    }
    
    try {
      // Pass the webhook payload to our internal action that handles Stripe events
      const result = await ctx.runAction(internal.stripe.handleWebhookEvent, {
        signature,
        payload: await request.text()
      });
      
      if (result.success) {
        return new Response(null, { status: 200 });
      } else {
        return new Response(result.error || "Webhook processing failed", { status: 400 });
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Server Error", { status: 500 });
    }
  })
});

export default http;
