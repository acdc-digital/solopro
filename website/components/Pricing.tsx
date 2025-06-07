// PRICING COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/Pricing.tsx

"use client";

import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StripeCheckoutModal } from "@/modals/StripeCheckoutModal";
import { StripeSetupInstructions } from "./StripeSetupInstructions";
import { SignInModal } from "@/modals/SignInModal";

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

export default function Pricing() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const hasActiveSubscription = useQuery(api.userSubscriptions.hasActiveSubscription);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInFlow, setSignInFlow] = useState<"signIn" | "signUp">("signIn");
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Debug the subscription state
  console.log("Pricing component - hasActiveSubscription:", hasActiveSubscription);
  console.log("Pricing component - isAuthenticated:", isAuthenticated);
  console.log("Pricing component - isLoading:", isLoading);

  const tiers: PricingTier[] = [
    {
      name: "Free",
      description: "Limited browser-only experience",
      price: "$0",
      features: [
        "Browser-only access",
        "Basic mood tracking",
        "7-day data history",
        "Limited insights",
      ],
      cta: "Try Browser App",
      productId: "prod_SM2rv1Y1tRAaKo",
    },
    {
      name: "Pro",
      description: "Full experience with 14-day free trial",
      price: "$12",
      features: [
        "Desktop & mobile apps",
        "Unlimited mood tracking", 
        "AI-powered insights",
        "Mood forecasting",
        "Data export & backup",
        "Priority support",
      ],
      cta: "Start Free Trial",
      highlighted: true,
      productId: "prod_SM2sXHSNLlJMj5",
      priceId: "price_1RRKmcD6Nyv2PKYjyVj96QH8",
      paymentMode: "subscription",
    },
    {
      name: "Coming Soon",
      description: "Advanced features in development",
      price: "2026",
      features: [
        "Team collaboration",
        "Advanced data visualization",
        "Custom integrations",
        "White-label options",
        "Enterprise features",
        "API access",
      ],
      cta: "Stay Updated",
      productId: "prod_SM2stqz0a2vhGb",
    },
  ];

  const handlePriceSelection = async (tier: PricingTier) => {
    console.log(`handlePriceSelection called for tier: ${tier.name}`);
    console.log(`Auth state - isAuthenticated: ${isAuthenticated}, isLoading: ${isLoading}`);
    console.log(`Subscription state - hasActiveSubscription: ${hasActiveSubscription}`);
    
    if (tier.name === "Free") {
      // Route directly to the dashboard
      window.location.href = process.env.NEXT_PUBLIC_APP_URL || "https://app.acdc.digital" + "/dashboard";
      return;
    }

    if (tier.name === "Coming Soon") {
      // Here you could redirect to a newsletter signup or feature request page
      window.location.href = "/#features";
      return;
    }

    // Handle Pro tier with Stripe checkout modal, but check authentication first
    if (tier.priceId) {
      console.log(`Selected ${tier.name} tier with price ID: ${tier.priceId}`);
      setSelectedTier(tier);

      // Check if user is authenticated
      if (isLoading) {
        console.log("Auth state is still loading, waiting...");
        // If still loading auth state, wait briefly then try again
        setTimeout(() => handlePriceSelection(tier), 500);
        return;
      }

      if (!isAuthenticated) {
        // If not authenticated, show sign in modal
        console.log("User not authenticated, showing sign-in modal");
        setSignInFlow("signIn");
        setIsSignInModalOpen(true);
        return;
      }

      // Wait for subscription query to load before checking
      if (hasActiveSubscription === undefined) {
        console.log("Subscription state is still loading, waiting...");
        setTimeout(() => handlePriceSelection(tier), 500);
        return;
      }

      // Check if user already has an active subscription
      if (hasActiveSubscription === true) {
        console.log("User has active subscription, blocking checkout");
        alert("You already have an active subscription! No need to purchase again.");
        return;
      }

      console.log("User is authenticated and has no active subscription, opening checkout modal");
      // User is authenticated and doesn't have an active subscription, proceed with checkout
      setIsCheckoutModalOpen(true);

      // Check if Stripe public key is set
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
        setShowInstructions(true);
      }
    } else {
      console.error(`Price ID not found for tier: ${tier.name}`);
    }
  };

  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    setSelectedTier(null);
  };

  const handleSignInModalClose = () => {
    setIsSignInModalOpen(false);
  };

  const handleAuthSuccess = () => {
    console.log("handleAuthSuccess called");
    console.log(`Current auth state - isAuthenticated: ${isAuthenticated}, isLoading: ${isLoading}`);
    console.log(`Selected tier:`, selectedTier);
    
    // Hide sign-in modal
    setIsSignInModalOpen(false);

    // After successful authentication, immediately show the checkout modal
    // if we have a selected tier with a price ID
    if (selectedTier && selectedTier.priceId) {
      console.log(
        `Opening checkout modal for ${selectedTier.name} after successful sign-in`,
      );

      // Add a small delay to ensure UI state is updated properly
      setTimeout(() => {
        console.log("Delayed opening of checkout modal");
        setIsCheckoutModalOpen(true);
      }, 100);
    }
  };

  return (
    <section id="pricing" className="py-12 md:py-18">
      <div className="container mx-auto px-4 md:px-6">
        {showInstructions && <StripeSetupInstructions />}
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black mb-0 border border-black">
            <Sparkles className="h-4 w-4" />
            Pricing
          </div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="max-w-[85%] text-muted-foreground md:text-xl">
            Start with our free browser app or try Pro with a 14-day free trial. Cancel anytime.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-center">
          {tiers.map((tier) => {
            // Determine card styling based on tier type
            let cardClass =
              "relative flex flex-col rounded-lg border bg-background ";
            if (tier.highlighted) {
              cardClass += "border-emerald-600 shadow-md p-6 md:p-8 scale-105 z-10";
            } else if (tier.name === "Coming Soon") {
              cardClass +=
                "border-dashed border-muted-foreground/50 p-6 shadow-sm my-auto";
            } else {
              cardClass += "p-6 shadow-sm my-auto";
            }
            return (
              <div key={tier.name} className={cardClass}>
                {tier.highlighted && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                    Popular
                  </div>
                )}
                {tier.name === "Coming Soon" && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    Roadmap
                  </div>
                )}
                <div className="mb-4 space-y-2">
                  <h3
                    className={`font-bold ${tier.highlighted ? "text-2xl" : "text-xl"}`}
                  >
                    {tier.name}
                  </h3>
                  {tier.name === "Pro" ? (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs border border-emerald-600 font-medium">
                      Full experience with 14-day Free trial
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  {tier.name === "Pro" && (
                    <div className="mb-2">
                      <span className="text-3xl font-semibold text-emerald-600 decoration-2">$12</span>
                      <div className="text-sm text-muted-foreground">Free for 14 days, then $12/month</div>
                    </div>
                  )}
                  {tier.name !== "Pro" && (
                    <>
                      <span
                        className={`font-bold ${tier.highlighted ? "text-4xl" : "text-3xl"}`}
                      >
                        {tier.price}
                      </span>
                      {tier.name !== "Coming Soon" && tier.price !== "Custom" && (
                        <span className="ml-1 text-muted-foreground">/month</span>
                      )}
                    </>
                  )}
                </div>
                <ul className="mb-6 space-y-2 text-xs">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check
                        className={`mr-2 ${tier.highlighted ? "h-4 w-4" : "h-3 w-3"} ${tier.highlighted ? "text-emerald-700" : "text-primary"}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <button
                    onClick={() => handlePriceSelection(tier)}
                    disabled={tier.name === "Coming Soon" || (hasActiveSubscription === true && !!tier.priceId)}
                    className={`inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      hasActiveSubscription === true && tier.priceId
                        ? "bg-green-200 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-600 cursor-default"
                        : tier.highlighted
                        ? "bg-emerald-600 text-white shadow hover:bg-emerald-800 font-bold"
                        : tier.name === "Coming Soon"
                          ? "bg-muted text-muted-foreground cursor-default"
                          : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {hasActiveSubscription === true && tier.priceId ? "✓ Active" : tier.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stripe Checkout Modal */}
      <StripeCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckoutModal}
        priceId={selectedTier?.priceId}
        productName={selectedTier?.name || "SoloPro Subscription"}
        paymentMode={selectedTier?.paymentMode || "payment"}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={handleSignInModalClose}
        onAuthSuccess={handleAuthSuccess}
        initialFlow={signInFlow}
      />
    </section>
  );
}
