// ENVIRONMENT DETECTION UTILS
// /Users/matthewsimon/Documents/Github/solopro/renderer/src/utils/environment.ts

import React from 'react';

/**
 * Detects if the app is running in a browser environment (not Electron)
 * Returns true when running in a web browser, false when running in Electron
 */
export function isBrowserEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false; // SSR context, assume browser for now
  }
  
  // Check if Electron APIs are available
  return !(window as any).electron;
}

/**
 * Detects if the app is running in Electron
 */
export function isElectronEnvironment(): boolean {
  return !isBrowserEnvironment();
}

/**
 * React hook to detect browser environment with proper hydration handling
 */
export function useBrowserEnvironment(): boolean | null {
  const [isBrowser, setIsBrowser] = React.useState<boolean | null>(null);
  
  React.useEffect(() => {
    setIsBrowser(isBrowserEnvironment());
  }, []);
  
  return isBrowser;
} 