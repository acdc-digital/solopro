import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

/**
 * A hook that extends useConvexAuth to also get the actual user ID from Convex
 * Returns the same values as useConvexAuth plus the userId if available
 * 
 * Following authentication rules:
 * - Uses api.auth.getUserId for proper user identification
 * - Never uses ctx.auth.getUserIdentity().subject
 * - Provides consistent authentication state across the application
 */
export function useConvexUser() {
  const auth = useConvexAuth();
  
  // Query the actual user ID from Convex when authenticated
  // This follows the authentication rule: "Always use getAuthUserId(ctx) for secure user identification"
  const userId = useQuery(
    api.auth.getUserId,
    auth.isAuthenticated ? {} : "skip"
  );
  
  return {
    ...auth,
    userId: userId || null
  };
} 