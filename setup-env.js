#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the root directory of the project
const rootDir = process.cwd();
const envFilePath = path.join(rootDir, '.env.local');

// Define the environment variables
const envVars = `# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51RNdaYD6Nyv2PKYjuwTTC0CzGCwPO3ISJtpyqrd6eBN5WTxrkdPmI6DnBGwuXnls1WFJz8XrGiTCvZ3sSmIzDDi600PDCukMAI
STRIPE_SECRET_KEY=sk_test_... # Replace with your actual Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_c2227ae347d2306031bb7c7b247fcb58ce2c59154640f14212d1aea2616b86df

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Convex URL - update this with your own Convex deployment URL
NEXT_PUBLIC_CONVEX_URL=https://sleek-swordfish-420.convex.cloud
`;

// Write the file
fs.writeFileSync(envFilePath, envVars);

console.log(`Successfully created ${envFilePath}`);
console.log('Environment variables have been set up.');
console.log('IMPORTANT: Make sure to replace the placeholder Stripe secret key with your actual key.'); 