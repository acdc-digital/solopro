import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * A hook that extends useConvexAuth to also get the actual user ID from Convex
 * Returns the same values as useConvexAuth plus the userId if available
 */
export function useConvexUser() {
  const auth = useConvexAuth();
  
  // Query the actual user ID from Convex when authenticated
  const userId = useQuery(
    api.auth.getUserId,
    auth.isAuthenticated ? {} : "skip"
  );
  
  return {
    ...auth,
    userId: userId || null
  };
} 