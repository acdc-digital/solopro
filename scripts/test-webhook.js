#!/usr/bin/env node

import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '/Users/matthewsimon/Projects/solopro/website/.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testWebhook() {
  try {
    console.log('Testing webhook endpoint...');
    
    // Get your ngrok URL
    const webhookUrl = 'https://8baab56f32dd.ngrok-free.app/api/webhook/stripe';
    
    console.log('Webhook URL:', webhookUrl);
    console.log('Webhook Secret:', process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Missing');
    console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing');
    
    // Test webhook endpoint accessibility
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: 'data' })
    });
    
    console.log('Webhook endpoint response status:', response.status);
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (response.status === 400 && responseText.includes('Missing Stripe signature')) {
      console.log('✅ Webhook endpoint is accessible and correctly configured!');
      console.log('\nNext steps:');
      console.log('1. Go to your Stripe Dashboard: https://dashboard.stripe.com/webhooks');
      console.log('2. Add or update webhook endpoint URL to:', webhookUrl);
      console.log('3. Select these events: checkout.session.completed, customer.subscription.created, customer.subscription.updated, customer.subscription.deleted');
      console.log('4. Copy the webhook signing secret and update your .env.local file');
    } else {
      console.log('❌ Unexpected response from webhook endpoint');
    }
    
  } catch (error) {
    console.error('Error testing webhook:', error.message);
  }
}

testWebhook();
