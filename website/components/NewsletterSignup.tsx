// NEWSLETTER SIGNUP COMPONENT
// /Users/matthewsimon/Documents/Github/solopro/website/components/NewsletterSignup.tsx

"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Mail, Check, AlertCircle } from "lucide-react";

interface NewsletterSignupProps {
  source?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

export function NewsletterSignup({ 
  source = "footer", 
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  className = ""
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const addEmail = useMutation(api.newsletter.addEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your email");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await addEmail({ email: email.trim(), source });
      setStatus("success");
      setEmail("");
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
      
      // Reset error after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={status === "loading" || status === "success"}
            className={`
              w-full px-3 py-2 text-sm bg-background border rounded-md 
              focus:outline-none focus:ring-2 focus:ring-ring
              disabled:opacity-50 disabled:cursor-not-allowed
              ${status === "error" ? "border-red-500" : "border-input"}
              ${status === "success" ? "border-green-500" : ""}
            `}
          />
          {status === "success" && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {status === "error" && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
          )}
        </div>
        
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap
            disabled:opacity-50 disabled:cursor-not-allowed
            ${status === "success" 
              ? "bg-green-600 text-white" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          `}
        >
          {status === "loading" && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Subscribing...
            </div>
          )}
          {status === "success" && (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Subscribed!
            </div>
          )}
          {(status === "idle" || status === "error") && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {buttonText}
            </div>
          )}
        </button>
      </div>
      
      {status === "error" && errorMessage && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {errorMessage}
        </p>
      )}
      
      {status === "success" && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Thanks for subscribing! We'll keep you updated.
        </p>
      )}
    </form>
  );
} 