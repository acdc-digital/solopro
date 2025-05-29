// LANDING PAGE
// /Users/matthewsimon/Documents/Github/solopro/renderer/src/app/page.tsx

'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DraggableHeader from "./dashboard/_components/DraggableHeader";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { SignInModal } from "@/components/SignInModal";

/**
 * Landing Page Component for Electron Renderer
 * 
 * Following authentication rules:
 * - Uses useConvexUser() hook for consistent authentication state
 * - Checks authentication before rendering user-specific content
 * - Provides proper loading states and error handling
 * - Uses getAuthUserId pattern through the useConvexUser hook
 * - Redirects authenticated AND subscribed users to dashboard
 * - Opens subscription page in default browser for non-subscribed users
 */

// Helper function to open URL in default browser
const openInBrowser = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).electron?.shell) {
    (window as any).electron.shell.openExternal(url);
  } else {
    // Fallback for development or if Electron APIs aren't available
    window.open(url, '_blank');
  }
};

export default function LandingPage() {
  // Always call all hooks first, regardless of state
  const { isAuthenticated, isLoading, userId } = useConvexUser();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInFlow, setSignInFlow] = useState<"signIn" | "signUp">("signIn");

  // Always call useQuery hook - use "skip" when not authenticated
  const hasActiveSubscription = useQuery(
    api.userSubscriptions.hasActiveSubscription,
    isAuthenticated && userId ? {} : "skip"
  );

  // Redirect logic based on authentication and subscription status
  useEffect(() => {
    if (isAuthenticated && userId && !isLoading) {
      // Wait for subscription query to complete
      if (hasActiveSubscription === undefined) {
        console.log("Waiting for subscription status...");
        return;
      }

      if (hasActiveSubscription) {
        console.log("User is authenticated and has active subscription, redirecting to dashboard");
        router.push("/dashboard");
      } else {
        console.log("User is authenticated but no active subscription, opening subscription page in browser");
        // Open subscription page in default browser
        openInBrowser("http://localhost:3004/#pricing");
      }
    }
  }, [isAuthenticated, userId, isLoading, hasActiveSubscription, router]);

  // Handle authentication success
  const handleAuthSuccess = () => {
    setIsSignInModalOpen(false);
    router.refresh();
  };

  // Handle opening sign-in modal
  const handleSignInClick = () => {
    setSignInFlow("signIn");
    setIsSignInModalOpen(true);
  };

  // Handle opening sign-up modal
  const handleSignUpClick = () => {
    setSignInFlow("signUp");
    setIsSignInModalOpen(true);
  };

  // Determine what to render based on state
  let content;

  if (isLoading) {
    content = (
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex justify-center p-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  } else if (isAuthenticated && userId) {
    if (hasActiveSubscription === undefined) {
      // Still waiting for subscription status
      content = (
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex justify-center p-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
              <span className="text-sm text-muted-foreground">Checking subscription...</span>
            </div>
          </CardContent>
        </Card>
      );
    } else if (hasActiveSubscription) {
      // User has active subscription - show redirecting message
      content = (
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex justify-center p-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="text-sm text-muted-foreground">Redirecting to dashboard...</span>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      // User is authenticated but no subscription
      content = (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Subscription Required</CardTitle>
            <CardDescription>
              This app requires an active subscription to access
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              You're signed in successfully, but you need an active subscription to use the desktop app.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => openInBrowser("http://localhost:3004/#pricing")}
                className="w-full"
              >
                Open Subscription Plans in Browser
              </Button>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            <p>Visit our website to purchase a subscription</p>
          </CardFooter>
        </Card>
      );
    }
  } else {
    // Not authenticated - show sign-in form
    content = (
      <>
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">🔥 DEPLOYMENT TEST v2.0 🔥</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleSignInClick}
              className="w-full"
            >
              Sign In
            </Button>
            <Button
              onClick={handleSignUpClick}
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            <p>Secured authentication with Convex Auth</p>
          </CardFooter>
        </Card>

        {/* Sign In Modal */}
        <SignInModal
          isOpen={isSignInModalOpen}
          onClose={() => setIsSignInModalOpen(false)}
          initialFlow={signInFlow}
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DraggableHeader />
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        {content}
      </div>
    </div>
  );
}