"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { useConvexAuth } from "convex/react";
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
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInFlow, setSignInFlow] = useState<"signIn" | "signUp">("signIn");
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const tiers: PricingTier[] = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: "$0",
      features: [
        "Basic task management",
        "Up to 5 projects",
        "1GB storage",
        "Community support",
      ],
      cta: "Start Free",
      productId: "prod_SM2rv1Y1tRAaKo",
    },
    {
      name: "Pro",
      description: "For individuals and teams",
      price: "$12",
      features: [
        "Advanced task management",
        "Unlimited projects",
        "10GB storage",
        "Priority support",
        "Custom fields",
        "Advanced analytics",
      ],
      cta: "Get Started",
      highlighted: true,
      productId: "prod_SM2sXHSNLlJMj5",
      priceId: "price_1RRKmcD6Nyv2PKYjyVj96QH8",
      paymentMode: "payment",
    },
    {
      name: "Coming Soon",
      description: "Advanced features in development",
      price: "2026",
      features: [
        "AI-powered insights",
        "Team collaboration",
        "Advanced data visualization",
        "Mobile app access",
        "Custom integrations",
        "White-label options",
      ],
      cta: "Stay Updated",
      productId: "prod_SM2stqz0a2vhGb",
    },
  ];

  const handlePriceSelection = async (tier: PricingTier) => {
    if (tier.name === "Free") {
      // Show sign up modal for free tier
      setSignInFlow("signUp");
      setIsSignInModalOpen(true);
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

      // User is authenticated, proceed with checkout
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
        setIsCheckoutModalOpen(true);
      }, 100);
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {showInstructions && <StripeSetupInstructions />}
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="max-w-[85%] text-muted-foreground md:text-xl">
            Choose the plan that fits your needs. All plans include a 14-day
            free trial.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-center">
          {tiers.map((tier) => {
            // Determine card styling based on tier type
            let cardClass =
              "relative flex flex-col rounded-lg border bg-background ";
            if (tier.highlighted) {
              cardClass += "border-primary shadow-md p-6 md:p-8 scale-105 z-10";
            } else if (tier.name === "Coming Soon") {
              cardClass +=
                "border-dashed border-muted-foreground/50 p-6 shadow-sm my-auto";
            } else {
              cardClass += "p-6 shadow-sm my-auto";
            }
            return (
              <div key={tier.name} className={cardClass}>
                {tier.highlighted && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
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
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span
                    className={`font-bold ${tier.highlighted ? "text-4xl" : "text-3xl"}`}
                  >
                    {tier.price}
                  </span>
                  {tier.name !== "Coming Soon" && tier.price !== "Custom" && (
                    <span className="ml-1 text-muted-foreground">/month</span>
                  )}
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check
                        className={`mr-2 ${tier.highlighted ? "h-5 w-5" : "h-4 w-4"} text-primary`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <button
                    onClick={() => handlePriceSelection(tier)}
                    disabled={tier.name === "Coming Soon"}
                    className={`inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      tier.highlighted
                        ? "bg-primary text-primary-foreground shadow hover:bg-primary/90 font-bold"
                        : tier.name === "Coming Soon"
                          ? "bg-muted text-muted-foreground cursor-default"
                          : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {tier.cta}
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
