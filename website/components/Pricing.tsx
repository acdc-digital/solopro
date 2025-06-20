// PRICING COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/Pricing.tsx

"use client";

import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
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
  const isOnTeamsWaitlist = useQuery(api.waitlist.isOnWaitlist, { feature: "teams" });
  const joinWaitlist = useMutation(api.waitlist.joinWaitlist);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInFlow, setSignInFlow] = useState<"signIn" | "signUp">("signIn");
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  // Debug the subscription state
  console.log("Pricing component - hasActiveSubscription:", hasActiveSubscription);
  console.log("Pricing component - isAuthenticated:", isAuthenticated);
  console.log("Pricing component - isLoading:", isLoading);

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
      cta: "Start Free Today",
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
    {
      name: "Teams",
      description: "Share insights and support each other's wellbeing",
      price: "2026",
      features: [
        "Share mood insights with trusted friends",
        "Group wellbeing challenges",
        "Collaborative mood tracking",
        "Team wellness dashboards",
        "Supportive community features",
        "Shared goal setting & progress",
        "Privacy-first group insights",
      ],
      cta: "Join Waitlist",
      productId: "prod_SM2stqz0a2vhGb",
    },
  ];

  const handlePriceSelection = async (tier: PricingTier) => {
    console.log(`handlePriceSelection called for tier: ${tier.name}`);
    console.log(`Auth state - isAuthenticated: ${isAuthenticated}, isLoading: ${isLoading}`);
    console.log(`Subscription state - hasActiveSubscription: ${hasActiveSubscription}`);
    
    if (tier.name === "Free") {
      // Check if on mobile (viewport width < 640px which is Tailwind's 'sm' breakpoint)
      if (window.innerWidth < 640) {
        return; // Don't do anything on mobile for Free tier
      }
      
      // Check if user is authenticated for desktop
      if (isLoading) {
        console.log("Auth state is still loading, waiting...");
        setTimeout(() => handlePriceSelection(tier), 500);
        return;
      }

      if (!isAuthenticated) {
        // If not authenticated, show sign in modal
        console.log("User not authenticated, showing sign-in modal for Free tier");
        setSelectedTier(tier);
        setSignInFlow("signIn");
        setIsSignInModalOpen(true);
        return;
      }
      
      // User is authenticated, route to dashboard
      window.location.href = process.env.NEXT_PUBLIC_APP_URL || "https://app.acdc.digital" + "/dashboard";
      return;
    }

    if (tier.name === "Teams") {
      // Handle Teams waitlist signup
      if (isLoading) {
        console.log("Auth state is still loading, waiting...");
        setTimeout(() => handlePriceSelection(tier), 500);
        return;
      }

      if (!isAuthenticated) {
        // If not authenticated, show sign in modal for waitlist signup
        console.log("User not authenticated, showing sign-in modal for Teams waitlist");
        setSelectedTier(tier);
        setSignInFlow("signIn");
        setIsSignInModalOpen(true);
        return;
      }

      // User is authenticated, handle waitlist signup
      handleTeamsWaitlist();
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

    // Check if user selected Free tier
    if (selectedTier && selectedTier.name === "Free") {
      console.log("User authenticated for Free tier, redirecting to dashboard");
      window.location.href = process.env.NEXT_PUBLIC_APP_URL || "https://app.acdc.digital" + "/dashboard";
      return;
    }

    // Check if user selected Teams tier for waitlist
    if (selectedTier && selectedTier.name === "Teams") {
      console.log("User authenticated for Teams waitlist, joining waitlist");
      handleTeamsWaitlist();
      return;
    }

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

  const handleTeamsWaitlist = async () => {
    console.log("handleTeamsWaitlist called");
    setWaitlistLoading(true);
    try {
      const result = await joinWaitlist({ feature: "teams" });
      console.log("Teams waitlist signup successful", result);
      alert("🎉 You've successfully joined the Teams waitlist! We'll notify you when it's available.");
    } catch (error) {
      console.error("Error joining teams waitlist:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to join waitlist";
      alert(`❌ ${errorMessage}`);
    } finally {
      setWaitlistLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-10 sm:py-12 md:py-18">
      <div className="container mx-auto px-4 md:px-6">
        {showInstructions && <StripeSetupInstructions />}
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-3 sm:space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-black mb-0 border border-black">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            Pricing
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl px-2">
            Simple, Transparent Pricing
          </h2>
          <p className="max-w-[90%] sm:max-w-[85%] text-sm sm:text-base text-muted-foreground md:text-xl px-2">
          Take control of tomorrow, today. Start with a 14-day free trial. Cancel anytime.
          </p>
        </div>
        <div className="mx-auto mt-8 sm:mt-12 md:mt-16 grid max-w-5xl gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:items-center">
          {tiers.map((tier) => {
            // Determine card styling based on tier type
            let cardClass =
              "relative flex flex-col rounded-lg border bg-background ";
            if (tier.highlighted) {
              cardClass += "border-emerald-600 shadow-md p-5 sm:p-6 md:p-8 sm:scale-105 z-10";
            } else if (tier.name === "Teams") {
              cardClass +=
                "border-dashed border-muted-foreground/50 p-5 sm:p-6 shadow-sm my-auto";
            } else {
              cardClass += "p-5 sm:p-6 shadow-sm my-auto";
            }
            return (
              <div key={tier.name} className={cardClass}>
                {tier.highlighted && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                    Popular
                  </div>
                )}
                {tier.name === "Teams" && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium border border-muted-foreground">
                    Coming Soon
                  </div>
                )}
                <div className="mb-3 sm:mb-4 space-y-2">
                  <h3
                    className={`font-bold ${tier.highlighted ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}
                  >
                    {tier.name}
                  </h3>
                  {tier.name === "Pro" ? (
                    <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs border border-emerald-600 font-medium">
                      Full experience with 14-day Free trial
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  )}
                </div>
                <div className="mb-4 sm:mb-6">
                  {tier.name === "Pro" && (
                    <div className="mb-2">
                      <span className="text-2xl sm:text-3xl font-semibold text-emerald-600 decoration-2">$3</span>
                      <div className="text-xs sm:text-sm text-muted-foreground">Free for 14 days, then $3/month</div>
                    </div>
                  )}
                  {tier.name !== "Pro" && (
                    <>
                      <span
                        className={`font-bold ${tier.highlighted ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}
                      >
                        {tier.price}
                      </span>
                                             {tier.name !== "Teams" && tier.price !== "Custom" && (
                        <span className="ml-1 text-sm sm:text-base text-muted-foreground">/month</span>
                      )}
                    </>
                  )}
                </div>
                <ul className="mb-4 sm:mb-6 space-y-2 text-xs">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check
                        className={`mr-2 mt-0.5 flex-shrink-0 ${tier.highlighted ? "h-3 w-3 sm:h-4 sm:w-4" : "h-3 w-3"} ${tier.highlighted ? "text-emerald-700" : "text-primary"}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <button
                    onClick={() => handlePriceSelection(tier)}
                    disabled={
                      (tier.name === "Teams" && (isOnTeamsWaitlist || waitlistLoading)) || 
                      (hasActiveSubscription === true && !!tier.priceId)
                    }
                    className={`inline-flex h-10 sm:h-10 w-full items-center justify-center rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      tier.name === "Free" 
                        ? "bg-muted text-muted-foreground cursor-not-allowed sm:cursor-pointer sm:border sm:border-input sm:bg-background sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-95"
                        : "active:scale-95"
                    } ${
                      hasActiveSubscription === true && tier.priceId
                        ? "bg-green-200 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-600 cursor-default"
                        : tier.highlighted
                        ? "bg-emerald-600 text-white shadow hover:bg-emerald-800 font-bold"
                        : tier.name === "Teams"
                          ? (isOnTeamsWaitlist 
                            ? "bg-green-200 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-600 cursor-default"
                            : waitlistLoading
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-blue-600 text-white shadow hover:bg-blue-700 cursor-pointer")
                          : tier.name !== "Free" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {hasActiveSubscription === true && tier.priceId ? "✓ Active" : 
                     tier.name === "Free" ? (
                       <>
                         <span className="sm:hidden">Desktop Only</span>
                         <span className="hidden sm:inline">{tier.cta}</span>
                       </>
                     ) : tier.name === "Teams" ? (
                       isOnTeamsWaitlist ? "✓ On Waitlist" :
                       waitlistLoading ? "Joining..." :
                       tier.cta
                     ) : tier.cta}
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