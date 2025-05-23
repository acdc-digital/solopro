import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

auth.addHttpRoutes(http);

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
