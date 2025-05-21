"use client";

import React from "react";
import {
  Download,
  ChevronRight,
  ArrowRight
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { OpenSource } from "@/components/OpenSource";
import Pricing from "@/components/Pricing";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

// Button component with styling
const Button = ({ children, className, variant = "default" }: ButtonProps) => {
  const baseStyles = "font-medium rounded-full transition-colors px-4 py-2";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}>
      {children}
    </button>
  );
};

type AccordionItemProps = {
  question: string;
  children: React.ReactNode;
}

// Accordion component
const AccordionItem = ({ question, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border rounded-lg p-2 bg-background dark:border-border mb-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium px-4 py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="px-4 pt-2 pb-4 text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar with Theme Toggle */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Open Source Community Section */}
        <OpenSource />

        {/* Features Section */}
        <section id="features" className="py-16 container mx-auto px-4 mt-8">
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row gap-8 mb-24">
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-2xl font-bold">Your Daily Well-Being at a Glance.</h3>
              <p className="text-muted-foreground">
                The color-coded heatmap turns 365 scattered journal entries into one elegant, scrollable canvas. Instantly spot winning streaks, analyze looming slumps, and forecast your mood for tomorrow.
              </p>
              <div className="pt-4">
                <button className="flex items-center gap-2 p-0 font-medium text-primary hover:underline">
                  Learn more <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="md:w-1/2 aspect-video w-full">
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                <div className="rounded-lg border border-border p-8 flex items-center justify-center bg-muted/30 w-[85%] h-[85%]">
                  <span className="text-lg">Feature Screenshot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 & 3 (Side by side) */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 2 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Review the Past, Ready the Future.</h3>
              <p className="text-muted-foreground">
                SoloPro's Playground lets you look back to learn—and gear up for what's coming next.
              </p>
              <div className="pt-4 mb-6"></div>
              <div className="aspect-video w-full">
                <div className="h-full w-full flex items-center justify-left text-muted-foreground">
                  <div className="rounded-lg border border-border p-8 flex items-center justify-center bg-muted/30 w-[95%] h-[85%]">
                    <span className="text-lg">Feature Screenshot</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">See the Patterns. Shape the Progress.</h3>
              <p className="text-muted-foreground">
                Pinpoint why today felt different, watch real-time charts reveal emerging trends, and tag moments before they fade.
              </p>
              <div className="pt-4 mb-6"></div>
              <div className="aspect-video w-full">
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  <div className="rounded-lg border border-border p-8 flex items-center justify-center bg-muted/30 w-[90%] h-[85%]">
                    <span className="text-lg">Feature Screenshot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <Pricing />

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">FAQ Section</h2>

            <div className="max-w-3xl mx-auto">
              <AccordionItem question="Is it free to start?">
                Yes! You can start with our free plan which includes all the essential features you need to get started.
              </AccordionItem>
              <AccordionItem question="How long does setup take?">
                Setup takes less than 5 minutes. Just sign up, and you'll be ready to start using the platform right away.
              </AccordionItem>
              <AccordionItem question="What devices are supported?">
                SoloPro works on all modern browsers and devices, including desktops, laptops, tablets, and mobile phones.
              </AccordionItem>
              <AccordionItem question="How do I get help if needed?">
                We offer support through our community forums, documentation, and email support for paid plans.
              </AccordionItem>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Start Your Journey Today</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of users who have already transformed their productivity with SoloPro.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="h-12 flex items-center gap-2">
                <Download size={18} aria-hidden="true" />
                Get Started
              </Button>
              <Button variant="outline" className="h-12 flex items-center gap-2">
                Learn More <ChevronRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SoloPro. All Rights Reserved.
            </p>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                GitHub
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Discord
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
