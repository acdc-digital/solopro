"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CreditCard } from "lucide-react";
import { createCheckoutSession } from "@/lib/services/PaymentService";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";

// Make sure to load the Stripe instance with your publishable key
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  : null;

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceId?: string;
  productName: string;
  paymentMode?: 'payment' | 'subscription';
}

export function StripeCheckoutModal({ 
  isOpen, 
  onClose, 
  priceId, 
  productName,
  paymentMode = 'payment'
}: StripeCheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // Create the checkout session when the modal opens
  useEffect(() => {
    if (isOpen && priceId) {
      setLoading(true);
      setError(null);
      setClientSecret(null);
      
      createCheckoutSession(priceId, paymentMode, true)
        .then((data) => {
          console.log("Checkout API response:", data);
          
          if (data.clientSecret) {
            console.log("Client secret received");
            setClientSecret(data.clientSecret);
          } else if (data.url) {
            // Handle fallback to redirect if needed
            console.log("Received URL instead of client secret, will fallback to redirect");
            window.open(data.url, '_blank');
            onClose();
          } else {
            setError("Could not initialize checkout. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error creating checkout session:", error);
          setError("An error occurred. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Reset on close
      setClientSecret(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, priceId, paymentMode, onClose]);

  // Control body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to ensure scrolling is re-enabled
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle case where Stripe public key is not set
  const isStripeConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md md:max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col max-h-[90vh] h-auto overflow-hidden">
        <div className="flex justify-between items-center pb-4 border-b mb-4">
          <h2 className="text-xl font-bold">{productName} Checkout</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Close checkout modal"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Preparing secure checkout...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 max-w-md">
                <p>{error}</p>
              </div>
              
              {!isStripeConfigured && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300 max-w-md">
                  <p>Stripe API keys not configured. Please set up your environment variables.</p>
                </div>
              )}
              
              <button
                onClick={onClose}
                className="mt-6 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Return to Homepage
              </button>
            </div>
          ) : clientSecret && stripePromise ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 w-full min-h-[400px]">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ clientSecret }}
                >
                  <EmbeddedCheckout className="h-full" />
                </EmbeddedCheckoutProvider>
              </div>
              
              <div className="mt-4 flex items-center justify-center text-xs text-muted-foreground">
                <CreditCard className="h-3 w-3 mr-1" />
                <span>Secure payment processed by Stripe</span>
              </div>
            </div>
          ) : !isStripeConfigured ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300 max-w-md">
                <p className="font-medium">Stripe API keys not configured</p>
                <p className="mt-2 text-sm">
                  To use embedded checkout, please configure your Stripe API keys in the environment variables.
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="mt-6 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Initializing checkout...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 