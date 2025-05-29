"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Debug: Check if CONVEX_URL is set
console.log("🟡 CONVEX_URL:", process.env.NEXT_PUBLIC_CONVEX_URL);

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Debug: Check if convex client initialized
console.log("🟡 Convex client:", convex);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  console.log("🟡 ConvexClientProvider rendering...");
  
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  );
} 