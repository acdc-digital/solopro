'use client'

import { Check } from "lucide-react";
import Link from "next/link";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export default function Pricing() {
  const tiers: PricingTier[] = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: "$0",
      features: [
        "Basic task management",
        "Up to 5 projects",
        "1GB storage",
        "Community support"
      ],
      cta: "Start Free"
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
        "Advanced analytics"
      ],
      cta: "Get Started",
      highlighted: true
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: "Custom",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Single sign-on (SSO)",
        "Dedicated support",
        "Custom integrations",
        "Advanced security"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
          <p className="max-w-[85%] text-muted-foreground md:text-xl">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-lg border bg-background p-6 shadow-sm ${
                tier.highlighted ? 'border-primary shadow-md' : ''
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Popular
                </div>
              )}
              <div className="mb-4 space-y-2">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.price !== "Custom" && <span className="ml-1 text-muted-foreground">/month</span>}
              </div>
              <ul className="mb-6 space-y-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link
                  href={tier.name === "Enterprise" ? "/contact" : "/signin"}
                  className={`inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                    tier.highlighted
                      ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
                      : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 