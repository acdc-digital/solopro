// LANDING PAGE
// /Users/matthewsimon/Documents/Github/solopro/renderer/src/app/page.tsx

'use client'

import { useEffect } from "react";
import { SignInWithGitHub } from "@/auth/oauth/SignInWithGitHub";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DraggableHeader from "./dashboard/_components/DraggableHeader";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

/**
 * Landing Page Component for Electron Renderer
 * 
 * Following authentication rules:
 * - Uses useConvexUser() hook for consistent authentication state
 * - Checks authentication before rendering user-specific content
 * - Provides proper loading states and error handling
 * - Uses getAuthUserId pattern through the useConvexUser hook
 * - Redirects authenticated users to dashboard
 */
export default function LandingPage() {
  const { isAuthenticated, isLoading, userId } = useConvexUser();
  const { signOut } = useAuthActions();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && userId && !isLoading) {
      console.log("User is authenticated, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [isAuthenticated, userId, isLoading, router]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DraggableHeader />
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="flex justify-center p-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If authenticated, show loading while redirecting
  if (isAuthenticated && userId) {
    return (
      <div className="min-h-screen bg-background">
        <DraggableHeader />
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="flex justify-center p-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="text-sm text-muted-foreground">Redirecting to dashboard...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If not authenticated, show sign-in form
  return (
    <div className="min-h-screen bg-background">
      <DraggableHeader />
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SignInWithGitHub />
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            <p>Secured authentication with Convex Auth</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}