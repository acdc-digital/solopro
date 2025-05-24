'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useState } from 'react';

export function StripeSetupInstructions() {
  const [closed, setClosed] = useState(false);
  
  if (closed) return null;
  
  return (
    <Alert className="my-4">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Stripe Environment Setup Required</AlertTitle>
      <AlertDescription className="mt-3">
        <p className="mb-2">
          For the embedded Stripe checkout to work, you need to create a <code>.env.local</code> file in your project root with the following variables:
        </p>
        
        <pre className="p-3 bg-muted rounded text-sm overflow-x-auto">
          <code>
            {`# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_public_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000`}
          </code>
        </pre>
        
        <p className="mt-3">
          Get your API keys from the <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-primary underline">Stripe Dashboard</a>.
        </p>
        
        <button 
          onClick={() => setClosed(true)} 
          className="mt-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Dismiss
        </button>
      </AlertDescription>
    </Alert>
  );
} 