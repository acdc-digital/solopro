#!/usr/bin/env node

import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '/Users/matthewsimon/Projects/solopro/website/.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = 'whsec_AJa6SnOLmUOsKrdiMQDf6EowEHQzkHm0'; // Use the new production secret

async function testRealWebhook() {
  try {
    console.log('Creating a real test webhook event...');
    
    // Create a minimal checkout session event payload
    const testEvent = {
      id: 'evt_test_webhook',
      object: 'event',
      api_version: '2024-06-20',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'cs_test_123',
          object: 'checkout.session',
          amount_total: 2900,
          currency: 'usd',
          customer: 'cus_test_123',
          customer_details: {
            email: 'test@example.com'
          },
          client_reference_id: 'user_test_123',
          mode: 'subscription',
          status: 'complete',
          subscription: 'sub_test_123'
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

    // Create the payload string
    const payload = JSON.stringify(testEvent);
    console.log('Payload created, length:', payload.length);

    // Create timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create signature like Stripe does
    const elements = [`t=${timestamp}`, `v1=${payload}`];
    const signaturePayload = elements.join(',');
    
    // Create the signature using webhook secret
    const crypto = await import('crypto');
    const signature = crypto.createHmac('sha256', webhookSecret)
      .update(`${timestamp}.${payload}`, 'utf8')
      .digest('hex');
    
    const stripeSignature = `t=${timestamp},v1=${signature}`;
    
    console.log('Signature created:', stripeSignature.substring(0, 50) + '...');
    
    // Send to webhook endpoint
    const webhookUrl = 'http://localhost:3004/api/webhook/stripe';
    console.log('Sending to:', webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': stripeSignature,
        'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)'
      },
      body: payload
    });
    
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (response.status === 200) {
      console.log('✅ Webhook test successful!');
    } else {
      console.log('❌ Webhook test failed');
    }
    
  } catch (error) {
    console.error('Error testing webhook:', error.message);
  }
}

testRealWebhook();
