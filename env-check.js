#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

console.log("Environment Variables Check:");
console.log("---------------------------");
console.log("NEXT_PUBLIC_STRIPE_PUBLIC_KEY:", process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ? "Loaded" : "Not loaded");
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "Not loaded");
console.log("STRIPE_WEBHOOK_SECRET:", process.env.STRIPE_WEBHOOK_SECRET ? "Loaded" : "Not loaded");
console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
console.log("NEXT_PUBLIC_CONVEX_URL:", process.env.NEXT_PUBLIC_CONVEX_URL); 