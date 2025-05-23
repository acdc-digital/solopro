# solopro
soloist-pro_v2

# SoloPro

SoloPro application

## Stripe Webhook Setup for Subscription Tracking

After deploying your application, you need to set up a Stripe webhook to properly track subscription status changes:

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. For the endpoint URL, enter: `https://your-domain.com/api/stripe/webhook`
   - Replace `your-domain.com` with your actual domain name
   - Make sure you're using HTTPS

4. Select the following events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`

5. After creating the webhook, Stripe will show a signing secret. Copy this value.

6. Add the webhook secret to your environment variables:
   - For Convex: `STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret`
   - Replace `whsec_your_webhook_secret` with your actual webhook signing secret

7. Restart your application or redeploy with the new environment variables

## Environment Variables

Make sure to set the following environment variables:

```
# Stripe
STRIPE_SECRET_KEY=sk_your_stripe_secret_key
STRIPE_PUBLIC_KEY=pk_your_stripe_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Other app variables
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Testing Webhooks Locally

To test webhooks during local development:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run `stripe login` to authenticate
3. Forward webhooks to your local server:
   ```
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. The CLI will display a webhook signing secret. Add this to your local environment variables.
