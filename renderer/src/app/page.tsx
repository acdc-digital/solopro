// LANDING PAGE
// /Users/matthewsimon/Documents/Github/solopro/renderer/src/app/page.tsx

'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DraggableHeader from "./dashboard/_components/DraggableHeader";
import { BrowserNavbar } from "@/components/BrowserNavbar";
import { BrowserFooter } from "@/components/BrowserFooter";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { SignInModal } from "@/components/SignInModal";
import { useBrowserEnvironment } from "@/utils/environment";

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
  const [signInFlow, setSignInFlow] = useState<"signIn" | "signUp" | "forgotPassword">("signIn");
  const isBrowser = useBrowserEnvironment();

  // Always call useQuery hook - use "skip" when not authenticated
  const hasActiveSubscription = useQuery(
    api.userSubscriptions.hasActiveSubscription,
    isAuthenticated && userId ? {} : "skip"
  );

  // Redirect logic for authenticated users (both browser and Electron mode)
  useEffect(() => {
    if (isAuthenticated && userId && !isLoading) {
      // Wait for subscription query to complete
      if (hasActiveSubscription === undefined) {
        console.log("Waiting for subscription status...");
        return;
      }

      // Always redirect authenticated users to dashboard (regardless of subscription status)
      console.log("User is authenticated, redirecting to dashboard");
      router.push("/dashboard");
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
      <Card className="w-full max-w-md shadow-lg backdrop-blur-sm bg-white/80 dark:bg-zinc-900/80 border-zinc-200/50 dark:border-zinc-800/50">
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
        <Card className="w-full max-w-md shadow-lg backdrop-blur-sm bg-white/80 dark:bg-zinc-900/80 border-zinc-200/50 dark:border-zinc-800/50">
          <CardContent className="flex justify-center p-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
              <span className="text-sm text-muted-foreground">Checking subscription...</span>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      // User is authenticated - redirect to dashboard
      content = (
        <Card className="w-full max-w-md shadow-lg backdrop-blur-sm bg-white/80 dark:bg-zinc-900/80 border-zinc-200/50 dark:border-zinc-800/50">
          <CardContent className="flex justify-center p-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="text-sm text-muted-foreground">Redirecting to dashboard...</span>
            </div>
          </CardContent>
        </Card>
      );
    }
  } else {
    // Not authenticated - show sign-in form
    content = (
      <>
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome to Soloist</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSignInClick}
              className="w-full"
              variant="default"
            >
              Sign in
            </Button>
            <Button
              onClick={handleSignUpClick}
              variant="outline"
              className="w-full"
            >
              Create account
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

    return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      {/* Show different headers based on environment */}
      {isBrowser === true ? (
        <BrowserNavbar />
      ) : isBrowser === false ? (
        <DraggableHeader />
      ) : null /* Show nothing during hydration */}
      
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        {content}
      </div>
      
      {/* Browser Footer - Only show when confirmed browser mode */}
      {isBrowser === true && <BrowserFooter />}
      
      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        initialFlow={signInFlow}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}