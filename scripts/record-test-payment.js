#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { ConvexHttpClient } = require('convex/browser');

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.error('Missing NEXT_PUBLIC_CONVEX_URL environment variable');
  process.exit(1);
}

async function recordTestPayment() {
  try {
    console.log('Connecting to Convex at:', convexUrl);
    const convex = new ConvexHttpClient(convexUrl);
    
    console.log('Recording test payment...');
    const result = await convex.mutation('myFunctions:testRecordPayment', {});
    
    console.log('Result:', result);
    if (result.success) {
      console.log('✅ Test payment recorded successfully!');
      console.log('Payment ID:', result.paymentId);
      console.log('User ID:', result.userId);
    } else {
      console.error('❌ Failed to record test payment:', result.error);
    }
  } catch (error) {
    console.error('Error recording test payment:', error);
  }
}

recordTestPayment(); 