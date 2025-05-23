"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Loader2, CreditCard, CheckCircle } from "lucide-react";
import { createCheckoutSession } from "@/lib/services/PaymentService";
import { useConvexUser } from "@/lib/hooks/useConvexUser";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { getStripePromise, isStripeConfigured } from "@/lib/stripe/stripeLoader";

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
  const { isAuthenticated, isLoading, userId } = useConvexUser();
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const sessionCreatedRef = useRef(false);

  // Debug logging
  useEffect(() => {
    console.log("StripeCheckoutModal - useConvexUser state:", {
      isAuthenticated,
      isLoading,
      userId,
      isOpen,
      priceId
    });

    // Additional debug info
    console.log("StripeCheckoutModal - Authentication check:");
    console.log("  isLoading:", isLoading);
    console.log("  isAuthenticated:", isAuthenticated);
    console.log("  userId:", userId);
    console.log("  Will show auth message:", !isLoading && !isAuthenticated);
    console.log("  Modal isOpen:", isOpen);
  }, [isAuthenticated, isLoading, userId, isOpen, priceId]);

  // Check if Stripe is configured
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const configured = isStripeConfigured();
      setStripeConfigured(configured);

      if (!configured) {
        console.error("Stripe is not properly configured. Missing public key.");
      }
    }
  }, []);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setPaymentCompleted(false);
      setClientSecret(null);
      setError(null);
      setLoading(false);
      sessionCreatedRef.current = false;
    }
  }, [isOpen]);

  // Handle checkout completion
  const handleCheckoutComplete = useCallback(() => {
    setPaymentCompleted(true);
  }, []);

  // Create the checkout session when the modal opens
  useEffect(() => {
    // Only create session if:
    // 1. Modal is open
    // 2. We have a price ID
    // 3. We have a user ID
    // 4. User is authenticated
    // 5. We haven't already created a session for this modal open
    if (isOpen && priceId && userId && isAuthenticated && !sessionCreatedRef.current) {
      console.log("Creating checkout session effect triggered");
      console.log("Current userId:", userId);
      console.log("isAuthenticated:", isAuthenticated);

      setLoading(true);
      setError(null);
      sessionCreatedRef.current = true;

      console.log("Creating checkout session with userId:", userId);
      createCheckoutSession(priceId, paymentMode, true, userId)
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
          sessionCreatedRef.current = false; // Reset on error so user can retry
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, priceId, paymentMode, userId, isAuthenticated]); // Added isAuthenticated to dependencies

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

  if (!isOpen) return null;

  // More robust authentication check
  const shouldShowAuthMessage = !isLoading && (!isAuthenticated || !userId);

  console.log("StripeCheckoutModal - Final authentication decision:", {
    shouldShowAuthMessage,
    isLoading,
    isAuthenticated,
    userId,
    condition: `!${isLoading} && (!${isAuthenticated} || !${userId})`
  });

  // Show authentication message if not authenticated
  if (shouldShowAuthMessage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative w-full max-w-md md:max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center pb-4 border-b mb-4">
            <h2 className="text-xl font-bold">Authentication Required</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
          <div className="py-4">
            <p className="mb-4">You need to be logged in to make a purchase.</p>
            <button
              onClick={onClose}
              className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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

              {!stripeConfigured && (
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
          ) : clientSecret && stripeConfigured ? (
            <div className="h-full flex flex-col">
              {paymentCompleted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank You for Your Purchase!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Your payment has been processed successfully. You now have access to all
                    {paymentMode === 'subscription' ? ' premium features for the duration of your subscription.' : ' premium features.'}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={onClose}
                      className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Return to Dashboard
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-2 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 w-full min-h-[400px]">
                  <EmbeddedCheckoutProvider
                    stripe={getStripePromise()}
                    options={{
                      clientSecret,
                      onComplete: handleCheckoutComplete
                    }}
                  >
                    <EmbeddedCheckout className="h-full" />
                  </EmbeddedCheckoutProvider>
                </div>
              )}

              {!paymentCompleted && (
                <div className="mt-4 flex items-center justify-center text-xs text-muted-foreground">
                  <CreditCard className="h-3 w-3 mr-1" />
                  <span>Secure payment processed by Stripe</span>
                </div>
              )}
            </div>
          ) : !stripeConfigured ? (
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