import { loadStripe, Stripe } from "@stripe/stripe-js";

// This is a singleton to ensure we only create one instance
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripePromise = (): Promise<Stripe | null> => {
  if (!stripePromise && typeof window !== 'undefined') {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
    
    if (key) {
      stripePromise = loadStripe(key);
    } else {
      console.error("Stripe public key is missing! Please check your environment variables.");
      // Return a rejected promise instead of null
      stripePromise = Promise.resolve(null);
    }
  }
  
  // Return a promise even if stripePromise is null (server-side)
  return stripePromise || Promise.resolve(null);
};

// Function to check if Stripe is properly configured
export const isStripeConfigured = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Server-side
  }
  
  return !!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
}; 