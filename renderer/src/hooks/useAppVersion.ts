import { useState, useEffect } from 'react';

export interface VersionInfo {
  current: string;
  latest: string | null;
  updateAvailable: boolean;
  isChecking: boolean;
  error: string | null;
  releaseNotes?: string;
}

export function useAppVersion() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo>({
    current: '1.6.5', // Fallback version
    latest: null,
    updateAvailable: false,
    isChecking: true,
    error: null
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get current version from Electron if available
  useEffect(() => {
    const getCurrentVersion = () => {
      try {
        // Try to get version from Electron
        if (typeof window !== 'undefined' && (window as any).electron) {
          return (window as any).electron.getVersion?.() || '1.6.5';
        }
        // Fallback for web/development
        return '1.6.5';
      } catch (error) {
        console.warn('Could not get app version:', error);
        return '1.6.5';
      }
    };

    const currentVersion = getCurrentVersion();
    setVersionInfo(prev => ({ ...prev, current: currentVersion }));
  }, []);

  // Check for updates
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        setVersionInfo(prev => ({ ...prev, isChecking: true, error: null }));
        
        // Create a minimum loading time of 2 seconds
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fetch latest version from GitHub releases
        const apiCall = fetch('https://api.github.com/repos/acdc-digital/solopro/releases/latest', {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        
        // Wait for both the API call and minimum loading time
        const [response] = await Promise.all([apiCall, minLoadingTime]);
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const latestVersion = data.tag_name?.replace('v', '') || data.name?.replace('v', '');
        
        if (!latestVersion) {
          throw new Error('Invalid version format from GitHub');
        }

        const updateAvailable = isNewerVersion(latestVersion, versionInfo.current);
        
        setVersionInfo(prev => ({
          ...prev,
          latest: latestVersion,
          updateAvailable,
          isChecking: false,
          releaseNotes: data.html_url
        }));
        
      } catch (error) {
        console.error('Error checking for updates:', error);
        // Even with errors, wait the minimum time for consistent UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        setVersionInfo(prev => ({
          ...prev,
          isChecking: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    // Only check for updates if we have a current version
    if (versionInfo.current) {
      checkForUpdates();
    }
  }, [versionInfo.current, refreshTrigger]);

  const handleUpdate = () => {
    try {
      // For Electron apps
      if (typeof window !== 'undefined' && (window as any).electron) {
        (window as any).electron.send('app-update');
        return;
      }
      
      // For web version - force reload with cache clear
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error triggering update:', error);
    }
  };

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    ...versionInfo,
    handleUpdate,
    refresh
  };
}

// Simple version comparison - assumes semantic versioning
function isNewerVersion(latest: string, current: string): boolean {
  const parseVersion = (version: string) => {
    return version.split('.').map(num => parseInt(num, 10));
  };
  
  const latestParts = parseVersion(latest);
  const currentParts = parseVersion(current);
  
  for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
    const latestPart = latestParts[i] || 0;
    const currentPart = currentParts[i] || 0;
    
    if (latestPart > currentPart) return true;
    if (latestPart < currentPart) return false;
  }
  
  return false;
} 