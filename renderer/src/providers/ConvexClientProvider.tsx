"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Debug: Check if CONVEX_URL is set
console.log("🟡 CONVEX_URL:", process.env.NEXT_PUBLIC_CONVEX_URL);

// Test API import
try {
  console.log("🟡 Testing API import...");
  const api = require("@/convex/_generated/api");
  console.log("🟡 API import successful:", !!api);
} catch (error) {
  console.error("🟡 API import failed:", error);
}

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