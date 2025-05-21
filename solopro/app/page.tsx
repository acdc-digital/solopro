"use client";

import React, { useEffect, useState } from "react";
import {
  Download,
  ChevronRight,
  CheckCircle,
  XCircle,
  X,
  Loader2,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { OpenSource } from "@/components/OpenSource";
import { Features } from "@/components/Features";
import Pricing from "@/components/Pricing";
import { getCheckoutSession } from "@/lib/services/PaymentService";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
};

// Button component with styling
const Button = ({ children, className, variant = "default" }: ButtonProps) => {
  const baseStyles = "font-medium rounded-full transition-colors px-4 py-2";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
    >
      {children}
    </button>
  );
};

type AccordionItemProps = {
  question: string;
  children: React.ReactNode;
};

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
        <ChevronRight
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="px-4 pt-2 pb-4 text-muted-foreground">{children}</div>
      )}
    </div>
  );
};

export default function LandingPage() {
  const [paymentStatus, setPaymentStatus] = useState<{
    type: "success" | "canceled" | null;
    message: string;
  } | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(false);

  // Check for payment status in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const success = queryParams.get("success");
    const canceled = queryParams.get("canceled");
    const sessionId = queryParams.get("session_id");

    if (success === "true") {
      setPaymentStatus({
        type: "success",
        message: "Payment successful! Your subscription is now active.",
      });

      // Clear the query parameters from the URL without page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled === "true") {
      setPaymentStatus({
        type: "canceled",
        message:
          "Payment was canceled. You can try again whenever you're ready.",
      });

      // Clear the query parameters from the URL without page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (sessionId) {
      // Check the session status from the API
      setIsCheckingSession(true);

      getCheckoutSession(sessionId)
        .then((session) => {
          console.log("Session details:", session);

          if (
            session.paymentStatus === "paid" ||
            session.status === "complete"
          ) {
            setPaymentStatus({
              type: "success",
              message: "Payment successful! Your subscription is now active.",
            });
          } else if (session.status === "open") {
            setPaymentStatus({
              type: "success",
              message:
                "Your payment is processing. Your subscription will be active shortly.",
            });
          } else {
            setPaymentStatus({
              type: "canceled",
              message:
                "The checkout was not completed. You can try again whenever you're ready.",
            });
          }
        })
        .catch((error) => {
          console.error("Failed to check session status:", error);
          setPaymentStatus({
            type: "canceled",
            message:
              "We couldn't verify your payment status. Please contact support if you completed a payment.",
          });
        })
        .finally(() => {
          setIsCheckingSession(false);
          // Clear the query parameters from the URL without page reload
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar with Theme Toggle */}
      <Navbar />

      {/* Payment Status Notification */}
      {isCheckingSession ? (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Verifying your payment status...
              </p>
            </div>
          </div>
        </div>
      ) : (
        paymentStatus && (
          <div
            className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
              paymentStatus.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {paymentStatus.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-amber-400" />
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    paymentStatus.type === "success"
                      ? "text-green-800 dark:text-green-200"
                      : "text-amber-800 dark:text-amber-200"
                  }`}
                >
                  {paymentStatus.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setPaymentStatus(null)}
                  className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    paymentStatus.type === "success"
                      ? "text-green-500 hover:bg-green-100 dark:hover:bg-green-800 focus:ring-green-600"
                      : "text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-800 focus:ring-amber-600"
                  }`}
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Open Source Community Section */}
        <OpenSource />

        {/* Features Section */}
        <Features />

        {/* Pricing Section */}
        <Pricing />

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">
              FAQ Section
            </h2>

            <div className="max-w-3xl mx-auto">
              <AccordionItem question="Is it free to start?">
                Yes! You can start with our free plan which includes all the
                essential features you need to get started.
              </AccordionItem>
              <AccordionItem question="How long does setup take?">
                Setup takes less than 5 minutes. Just sign up, and you'll be
                ready to start using the platform right away.
              </AccordionItem>
              <AccordionItem question="What devices are supported?">
                SoloPro works on all modern browsers and devices, including
                desktops, laptops, tablets, and mobile phones.
              </AccordionItem>
              <AccordionItem question="How do I get help if needed?">
                We offer support through our community forums, documentation,
                and email support for paid plans.
              </AccordionItem>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of users who have already transformed their
              productivity with SoloPro.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="h-12 flex items-center gap-2">
                <Download size={18} aria-hidden="true" />
                Get Started
              </Button>
              <Button
                variant="outline"
                className="h-12 flex items-center gap-2"
              >
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
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Discord
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
