"use client";

import React, { useState, useEffect } from "react";
import { Check, Sparkles, X, CreditCard } from "lucide-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentSuccess } from "./PaymentSuccess";

// Stripe types for embedded checkout
declare global {
  interface Window {
    Stripe?: any;
  }
}

interface PricingTier {
  name: string;
  description: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  productId?: string;
  priceId?: string;
  paymentMode?: "payment" | "subscription";
}

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const { isAuthenticated, isLoading, userId } = useConvexUser();
  const hasActiveSubscription = useQuery(
    api.userSubscriptions.hasActiveSubscription,
    isAuthenticated && userId ? {} : "skip"
  );
  const createCheckoutSession = useAction(api.payments.createCheckoutSession);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [stripe, setStripe] = useState<any>(null);
  const [checkoutSession, setCheckoutSession] = useState<any>(null);
  const [stripeLoading, setStripeLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null); // Store session ID

  // Initialize Stripe
  useEffect(() => {
    const loadStripe = async () => {
      console.log('Starting Stripe initialization...');
      
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      console.log('Stripe key available:', !!publishableKey);
      
      if (!publishableKey) {
        console.warn('Stripe publishable key not configured. Skipping Stripe initialization.');
        setStripeLoading(false);
        return;
      }
      
      if (typeof window !== 'undefined') {
        // Check if Stripe is already available
        if (window.Stripe) {
          console.log('Stripe already available, initializing...');
          try {
            const stripeInstance = window.Stripe(publishableKey);
            setStripe(stripeInstance);
            console.log('Stripe initialized successfully');
          } catch (error) {
            console.error('Error initializing Stripe:', error);
          }
          setStripeLoading(false);
          return;
        }

        // Load Stripe script
        console.log('Loading Stripe script...');
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        
        script.onload = () => {
          console.log('Stripe script loaded successfully');
          if (window.Stripe) {
            try {
              const stripeInstance = window.Stripe(publishableKey);
              setStripe(stripeInstance);
              console.log('Stripe initialized after script load');
            } catch (error) {
              console.error('Error initializing Stripe after script load:', error);
            }
          } else {
            console.error('Stripe not available after script load');
          }
          setStripeLoading(false);
        };
        
        script.onerror = (error) => {
          console.error('Failed to load Stripe script:', error);
          setStripeLoading(false);
        };
        
        document.head.appendChild(script);
      } else {
        console.log('Window not available, setting loading to false');
        setStripeLoading(false);
      }
    };

    loadStripe();

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (stripeLoading) {
        console.warn('Stripe loading timed out, proceeding without Stripe');
        setStripeLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => {
      clearTimeout(timeout);
    };
  }, [stripeLoading]);

  // Check for payment success from URL parameters (fallback for external redirects)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const sessionIdFromUrl = urlParams.get('session_id');
      const source = urlParams.get('source');
      
      // Only handle URL-based success if it's explicitly marked as from modal source
      // (This is a fallback in case the event-based handling doesn't work)
      if (paymentStatus === 'success' && sessionIdFromUrl && source === 'modal') {
        console.log('Handling payment success from URL parameters (fallback)');
        setPaymentSuccess(sessionIdFromUrl);
        // Clean up URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  // Mount the embedded checkout when we have a session
  useEffect(() => {
    let checkout: any = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const mountCheckout = async () => {
      if (stripe && checkoutSession?.clientSecret && showCheckout) {
        try {
          console.log('Mounting embedded checkout with client secret:', checkoutSession.clientSecret);
          
          // For embedded checkout, we need to use the initEmbeddedCheckout method
          const embeddedCheckout = await stripe.initEmbeddedCheckout({
            clientSecret: checkoutSession.clientSecret,
          });

          // Clear any existing content first
          const checkoutContainer = document.getElementById('checkout');
          if (checkoutContainer) {
            checkoutContainer.innerHTML = '';
            await embeddedCheckout.mount('#checkout');

            // Store reference for cleanup
            checkout = embeddedCheckout;
          }

          // For embedded checkout, let's use a simpler approach
          // We'll add a message listener for Stripe events
          const handleMessage = (event: MessageEvent) => {
            console.log('Received message event:', event.origin, event.data);
            
            // Check if the message is from Stripe
            if (event.origin !== 'https://js.stripe.com') return;
            
            if (event.data?.type === 'stripe_checkout_session_complete') {
              console.log('Checkout completed successfully via message!');
              const sessionId = checkoutSession.sessionId || checkoutSession.id;
              setPaymentSuccess(sessionId || 'success');
              setShowCheckout(false);
              // Remove event listener
              window.removeEventListener('message', handleMessage);
            }
          };

          // Listen for Stripe postMessage events
          window.addEventListener('message', handleMessage);

          // Store reference for cleanup
          checkout = {
            ...embeddedCheckout,
            cleanup: () => {
              window.removeEventListener('message', handleMessage);
              embeddedCheckout.unmount();
            }
          };

          console.log('Embedded checkout mounted, session ID:', checkoutSession.sessionId || checkoutSession.id);
        } catch (error) {
          console.error('Error mounting embedded checkout:', error);
          setProcessingPayment(false);
          setError('Failed to load payment form. Please try again.');
        }
      }
    };

    mountCheckout();

    // Cleanup function
    return () => {
      if (checkout) {
        try {
          if (checkout.cleanup) {
            checkout.cleanup();
          } else {
            checkout.unmount();
          }
        } catch (error) {
          console.error('Error unmounting checkout:', error);
        }
      }
    };
  }, [stripe, checkoutSession, showCheckout, checkoutSession?.sessionId]);

  const tiers: PricingTier[] = [
    {
      name: "Free",
      description: "Start your mood tracking journey",
      price: "$0",
      features: [
        "Full browser experience",
        "Daily Feedback & Mood Forecasting",
        "Auto-generate Daily entries",
        "7-day History",
        "Basic insights & patterns",
        "Heatmap visualization",
      ],
      cta: "Current Plan",
      productId: "prod_SM2rv1Y1tRAaKo",
    },
    {
      name: "Pro",
      description: "Unlock your full emotional potential",
      price: "$3",
      features: [
        "Everything in Free, plus:",
        "Native desktop application",
        "Unlimited mood history & forecasting",
        "Advanced analytics & trends",
        "Interactive playground",
        "Data export & backup",
        "Priority support",
      ],
      cta: "Start Free Trial",
      highlighted: true,
      productId: "prod_STXc0xIWjnn1R6",
      priceId: "price_1RYaXeD4wGLfhDePZlRBINbJ",
      paymentMode: "subscription",
    },
  ];

  const handlePriceSelection = async (tier: PricingTier) => {
    if (tier.name === "Free") {
      // Already on free plan, no action needed
      return;
    }

    if (tier.name === "Pro" && tier.priceId) {
      setLoading(true);
      setSelectedTier(tier);

      try {
        // Check if user already has an active subscription
        if (hasActiveSubscription === true) {
          alert("You already have an active subscription! No need to purchase again.");
          setLoading(false);
          return;
        }

        // Wait for Stripe to load if it's still loading
        if (stripeLoading) {
          alert("Payment system is loading. Please try again in a moment.");
          setLoading(false);
          return;
        }

        if (!stripe) {
          alert("Payment system is not available. Please refresh the page and try again.");
          setLoading(false);
          return;
        }

        setProcessingPayment(true);

        // Create checkout session using Convex action
        const session = await createCheckoutSession({
          priceId: tier.priceId,
          paymentMode: tier.paymentMode || 'subscription',
          embeddedCheckout: true,
        });

        if (session.clientSecret) {
          setCheckoutSession(session);
          setShowCheckout(true);
        } else {
          throw new Error("Failed to create checkout session");
        }
        
      } catch (error) {
        console.error("Error initiating checkout:", error);
        alert(`Error: ${error instanceof Error ? error.message : "Failed to start checkout"}`);
      } finally {
        setLoading(false);
        setProcessingPayment(false);
      }
    }
  };

  const isCurrentPlan = (tierName: string) => {
    if (tierName === "Free" && hasActiveSubscription === false) return true;
    if (tierName === "Pro" && hasActiveSubscription === true) return true;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">

          <DialogTitle className="text-2xl font-bold text-center">
            
          </DialogTitle>

        
        {paymentSuccess ? (
          <PaymentSuccess 
            sessionId={paymentSuccess}
            onComplete={() => {
              setPaymentSuccess(null);
              onOpenChange(false);
              // Trigger a page refresh to load new features
              window.location.reload();
            }}
          />
        ) : showCheckout ? (
          <div className="mt-6">
            {/* Stripe Embedded Checkout will be mounted here */}
            <div id="checkout" className="min-h-[400px]">
              {!checkoutSession?.clientSecret && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-zinc-600">Loading checkout...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCheckout(false);
                  setCheckoutSession(null);
                }}
                className="text-zinc-500 hover:text-zinc-700"
              >
                ← Back to plans
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-xl border-2 p-6 ${
                tier.highlighted
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  {tier.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.price !== "$0" && tier.name !== "2026" && (
                    <span className="text-zinc-600 dark:text-zinc-400">/month</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePriceSelection(tier)}
                disabled={loading || isCurrentPlan(tier.name) || stripeLoading}
                className={`w-full ${
                  tier.highlighted
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
                } ${
                  isCurrentPlan(tier.name) || stripeLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {loading && selectedTier?.name === tier.name && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                )}
                {stripeLoading && tier.name === "Pro" ? (
                  "Loading payment system..."
                ) : isCurrentPlan(tier.name) ? (
                  "Current Plan"
                ) : (
                  tier.cta
                )}
              </Button>
            </div>
          ))}
            </div>
          </>
        )}

        {!showCheckout && (
          <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <p>All plans include a 7-day free trial. Cancel anytime.</p>
            <p className="mt-1">Secure payments powered by Stripe.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
