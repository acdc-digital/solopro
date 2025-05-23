# Convex Payment Logging Implementation Guide

## Overview

This guide explains how to properly implement payment logging in Convex when using Stripe as the payment processor. The implementation ensures that all payments are properly recorded in your Convex database when users make purchases through Stripe Checkout.

## Architecture Overview

### Directory Structure
```
/
├── convex/                    # Convex backend functions
│   ├── auth.ts               # Convex Auth configuration
│   ├── payments.ts           # Payment recording mutations
│   ├── userSubscriptions.ts  # Subscription management
│   ├── stripe.ts             # Stripe-specific actions (Node.js)
│   ├── webhooks.ts           # Webhook processing mutations
│   └── schema.ts             # Database schema
│
└── solopro/                  # Next.js frontend
    ├── app/api/
    │   ├── create-checkout-session/  # Stripe checkout session creation
    │   └── webhook/stripe/           # Stripe webhook endpoint
    ├── components/
    │   └── Pricing.tsx              # Pricing component
    └── lib/hooks/
        └── useConvexUser.ts         # User authentication hook
```

## Key Components

### 1. User Authentication

The system uses Convex Auth for authentication. The user ID is retrieved using:

```typescript
// In convex/auth.ts
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity?.subject || null;
  },
});
```

### 2. Frontend User Hook

The `useConvexUser` hook provides authenticated user information:

```typescript
// In solopro/lib/hooks/useConvexUser.ts
export function useConvexUser() {
  const auth = useConvexAuth();
  
  // Query the actual user ID from Convex when authenticated
  const userId = useQuery(
    api.auth.getUserId,
    auth.isAuthenticated ? {} : "skip"
  );
  
  return {
    ...auth,
    userId: userId || null
  };
}
```

### 3. Database Schema

The schema defines two main tables for payment tracking:

```typescript
// In convex/schema.ts
payments: defineTable({
  userId: v.id("users"),
  stripeSessionId: v.string(),
  priceId: v.optional(v.string()),
  status: v.string(),
  productName: v.string(),
  paymentMode: v.string(),
  amount: v.optional(v.number()),
  currency: v.optional(v.string()),
  customerId: v.optional(v.string()),
  customerEmail: v.optional(v.string()),
  subscriptionId: v.optional(v.string()),
  subscriptionStatus: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
}).index("by_stripeSessionId", ["stripeSessionId"])
  .index("by_userId", ["userId"]),

userSubscriptions: defineTable({
  userId: v.id("users"),
  status: v.string(),
  subscriptionId: v.optional(v.string()),
  currentPeriodEnd: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
}).index("by_userId", ["userId"]),
```

## Payment Flow

### 1. Checkout Session Creation

When a user clicks to purchase, the frontend sends the user ID to Stripe:

```typescript
// In create-checkout-session API route
const sessionParams = {
  // ... other params
  client_reference_id: userId,  // Pass Convex user ID
  metadata: {
    userId,  // Also in metadata as backup
  },
};
```

### 2. Webhook Processing

When Stripe sends webhook events, they are processed by:

1. **Next.js API Route** (`/api/webhook/stripe/route.ts`)
   - Verifies the webhook signature
   - Calls the Convex mutation

2. **Convex Webhook Handler** (`convex/webhooks.ts`)
   - Processes different event types
   - Records payments and subscriptions

### 3. Payment Recording

The payment recording flow handles user lookup flexibly:

```typescript
// In convex/payments.ts - recordStripePayment
// Try multiple methods to find the user:
1. Direct user ID lookup
2. Customer email lookup
3. UserIdOrEmail as email lookup
```

## Implementation Steps

### Step 1: Set Up Environment Variables

```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
```

### Step 2: Configure Stripe Webhook

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhook/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook secret to your environment variables

### Step 3: Test the Integration

1. Make a test payment
2. Check Convex Dashboard for:
   - Payment record in `payments` table
   - Subscription record in `userSubscriptions` table (if applicable)
3. Check webhook logs in Stripe Dashboard

## Common Issues and Solutions

### Issue 1: User Not Found
**Problem**: Webhook can't find user
**Solution**: Ensure client_reference_id is set in checkout session with actual Convex user ID

### Issue 2: Webhook Signature Verification Failed
**Problem**: 400 error on webhook
**Solution**: Verify STRIPE_WEBHOOK_SECRET matches Stripe Dashboard

### Issue 3: Mutations in Node.js Files
**Problem**: "Only actions can be defined in Node.js" error
**Solution**: Move mutations to files without `"use node";` directive

### Issue 4: Missing Payments
**Problem**: Payments not recorded
**Solution**: Check that webhook endpoint is accessible and returning 200 status

## Best Practices

1. **Idempotency**: The system checks for existing payments before creating duplicates
2. **User Lookup**: Multiple fallback methods ensure user can be found
3. **Error Handling**: Comprehensive logging helps debug issues
4. **Type Safety**: Use proper Convex types (`Id<"users">`) for database operations

## Testing Webhooks Locally

Use Stripe CLI for local testing:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

## Monitoring and Debugging

1. **Convex Logs**: Check function logs in Convex Dashboard
2. **Stripe Logs**: Review webhook attempts in Stripe Dashboard
3. **Browser Console**: Check for client-side errors
4. **Network Tab**: Verify API calls are successful

## Security Considerations

1. Always verify webhook signatures
2. Use environment variables for sensitive keys
3. Implement proper error handling without exposing internal details
4. Validate user permissions before showing payment data

## Next Steps

1. Implement payment history UI
2. Add subscription management features
3. Set up email notifications
4. Create admin dashboard for payment monitoring 