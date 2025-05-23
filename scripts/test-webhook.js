// Test script to simulate a Stripe webhook
const crypto = require('crypto');

// Sample checkout.session.completed event
const event = {
  id: 'evt_test_webhook',
  object: 'event',
  api_version: '2025-04-30.basil',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'cs_test_webhook_' + Date.now(),
      object: 'checkout.session',
      amount_total: 1200,
      amount_subtotal: 1200,
      client_reference_id: 'jx796r8sa3pfrfz4xnw598t4cd7g98s9', // Using the actual user ID from logs
      created: Math.floor(Date.now() / 1000),
      currency: 'usd',
      customer: 'cus_test_' + Date.now(),
      customer_details: {
        email: 'msimon@acdc.digital',
        name: 'Test User'
      },
      customer_email: 'msimon@acdc.digital',
      livemode: false,
      metadata: {
        userId: 'jx796r8sa3pfrfz4xnw598t4cd7g98s9'
      },
      mode: 'payment',
      payment_intent: 'pi_test_' + Date.now(),
      payment_method_types: ['card'],
      payment_status: 'paid',
      status: 'complete',
      success_url: 'http://localhost:3002/dashboard?success=true',
      line_items: {
        object: 'list',
        data: [
          {
            id: 'li_test_' + Date.now(),
            object: 'item',
            amount_subtotal: 1200,
            amount_total: 1200,
            currency: 'usd',
            description: 'SoloPro Pro',
            price: {
              id: 'price_1RRKmcD6Nyv2PKYjyVj96QH8',
              object: 'price',
              active: true,
              currency: 'usd',
              product: 'prod_SM2sXHSNLlJMj5',
              unit_amount: 1200
            },
            quantity: 1
          }
        ]
      }
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: null,
    idempotency_key: null
  },
  type: 'checkout.session.completed'
};

// Generate a test signature
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test';
const timestamp = Math.floor(Date.now() / 1000);
const payload = JSON.stringify(event);
const signature = `t=${timestamp},v1=${crypto
  .createHmac('sha256', webhookSecret)
  .update(`${timestamp}.${payload}`)
  .digest('hex')}`;

console.log('Sending test webhook to http://localhost:3002/api/webhook/stripe');
console.log('Event type:', event.type);
console.log('User ID:', event.data.object.client_reference_id);

// Send the webhook
fetch('http://localhost:3002/api/webhook/stripe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'stripe-signature': signature
  },
  body: payload
})
.then(response => response.json())
.then(data => {
  console.log('Webhook response:', data);
})
.catch(error => {
  console.error('Error sending webhook:', error);
}); 