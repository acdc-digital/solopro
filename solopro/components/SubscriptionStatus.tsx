"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Loader2, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export function SubscriptionStatus() {
  // Fetch current user's subscription
  const subscription = useQuery(api.userSubscriptions.getCurrentSubscription);
  
  // Check if user has an active subscription
  const hasActiveSubscription = useQuery(api.userSubscriptions.hasActiveSubscription);
  
  // While loading, show a spinner
  if (subscription === undefined) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Checking subscription...</span>
      </div>
    );
  }
  
  // If no subscription is found
  if (!subscription) {
    return (
      <div className="flex items-center space-x-2">
        <XCircle className="h-4 w-4 text-amber-500" />
        <span className="text-sm">No active subscription</span>
      </div>
    );
  }
  
  // Format expiration date if available
  const formatExpirationDate = () => {
    if (!subscription.currentPeriodEnd) return null;
    
    const date = new Date(subscription.currentPeriodEnd * 1000);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get appropriate status display
  const getStatusDisplay = () => {
    if (hasActiveSubscription) {
      return (
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <span className="text-sm">
            Active subscription
            {subscription.currentPeriodEnd && 
              <span className="text-muted-foreground ml-1">
                (renews {formatExpirationDate()})
              </span>
            }
          </span>
        </div>
      );
    }
    
    if (subscription.status === "canceled") {
      return (
        <div className="flex items-center space-x-2">
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm">
            Subscription canceled
            {subscription.currentPeriodEnd && 
              <span className="text-muted-foreground ml-1">
                (expires {formatExpirationDate()})
              </span>
            }
          </span>
        </div>
      );
    }
    
    if (subscription.status === "past_due") {
      return (
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="text-sm">
            Payment past due
          </span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <span className="text-sm">
          Subscription status: {subscription.status}
        </span>
      </div>
    );
  };
  
  return (
    <div className="rounded-md border p-4 bg-background">
      <h3 className="text-sm font-medium mb-2">Subscription Status</h3>
      {getStatusDisplay()}
    </div>
  );
} 