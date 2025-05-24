"use client";

import { useState, useEffect } from "react";

export function EnvDebug() {
  const [envVars, setEnvVars] = useState({
    publicKey: null as string | null,
    baseUrl: null as string | null,
    convexUrl: null as string | null,
  });

  useEffect(() => {
    setEnvVars({
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || null,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || null,
      convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL || null,
    });
  }, []);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md mt-4">
      <h3 className="font-semibold mb-2">Environment Variables Status</h3>
      <ul className="space-y-1 text-sm">
        <li>
          NEXT_PUBLIC_STRIPE_PUBLIC_KEY:{" "}
          <span className={envVars.publicKey ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
            {envVars.publicKey ? "Loaded" : "Not loaded"}
          </span>
        </li>
        <li>
          NEXT_PUBLIC_BASE_URL:{" "}
          <span className={envVars.baseUrl ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
            {envVars.baseUrl || "Not loaded"}
          </span>
        </li>
        <li>
          NEXT_PUBLIC_CONVEX_URL:{" "}
          <span className={envVars.convexUrl ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
            {envVars.convexUrl || "Not loaded"}
          </span>
        </li>
      </ul>
    </div>
  );
} 