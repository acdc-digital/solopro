'use client';

import React, { useEffect, useState } from 'react';
import { Download, Monitor, Apple, Package } from 'lucide-react';

// Configuration
const LATEST_VERSION = "1.3.0";
const GITHUB_REPO = "acdc-digital/solopro"; // Update this with your actual GitHub repo

interface DownloadOption {
  os: string;
  icon: React.ReactNode;
  fileName: string;
  url: string;
  description: string;
  arch?: string;
}

const downloads: DownloadOption[] = [
  {
    os: 'Windows',
    icon: <Monitor className="w-8 h-8" />,
    fileName: `Soloist-Pro-Setup-${LATEST_VERSION}.exe`,
    url: `https://github.com/${GITHUB_REPO}/releases/download/v${LATEST_VERSION}/Soloist-Pro-Setup-${LATEST_VERSION}.exe`,
    description: 'Windows 10 or later (64-bit & 32-bit)',
  },
  {
    os: 'macOS',
    icon: <Apple className="w-8 h-8" />,
    fileName: `Soloist-Pro-${LATEST_VERSION}.dmg`,
    url: `https://github.com/${GITHUB_REPO}/releases/download/v${LATEST_VERSION}/Soloist-Pro-${LATEST_VERSION}.dmg`,
    description: 'macOS 10.15 or later (Intel & Apple Silicon)',
  },
  {
    os: 'Linux',
    icon: <Package className="w-8 h-8" />,
    fileName: `Soloist-Pro-${LATEST_VERSION}.AppImage`,
    url: `https://github.com/${GITHUB_REPO}/releases/download/v${LATEST_VERSION}/Soloist-Pro-${LATEST_VERSION}.AppImage`,
    description: 'Most Linux distributions (AppImage)',
  },
];

const additionalDownloads = [
  {
    os: 'Linux (Debian/Ubuntu)',
    fileName: `soloist-pro_${LATEST_VERSION}_amd64.deb`,
    url: `https://github.com/${GITHUB_REPO}/releases/download/v${LATEST_VERSION}/soloist-pro_${LATEST_VERSION}_amd64.deb`,
  },
  {
    os: 'Linux (Fedora/RHEL)',
    fileName: `soloist-pro-${LATEST_VERSION}.x86_64.rpm`,
    url: `https://github.com/${GITHUB_REPO}/releases/download/v${LATEST_VERSION}/soloist-pro-${LATEST_VERSION}.x86_64.rpm`,
  },
  {
    os: 'macOS (Apple Silicon)',
    fileName: `Soloist-Pro-${LATEST_VERSION}-arm64.dmg`,
    url: `https://github.com/${GITHUB_REPO}/releases/download/v${LATEST_VERSION}/Soloist-Pro-${LATEST_VERSION}-arm64.dmg`,
  },
];

export default function DownloadPage() {
  const [detectedOS, setDetectedOS] = useState<string>('');

  useEffect(() => {
    // Detect user's operating system
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) {
      setDetectedOS('Windows');
    } else if (userAgent.includes('mac')) {
      setDetectedOS('macOS');
    } else if (userAgent.includes('linux')) {
      setDetectedOS('Linux');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Download Soloist Pro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Version {LATEST_VERSION} • Professional Music Practice App
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Available for Windows, macOS, and Linux
          </p>
        </div>

        {/* Main Download Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {downloads.map((download) => {
            const isRecommended = download.os === detectedOS;
            return (
              <div
                key={download.os}
                className={`relative rounded-xl p-6 transition-all duration-200 ${
                  isRecommended
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl scale-105'
                    : 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                
                <div className={`flex items-center justify-center mb-4 ${
                  isRecommended ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {download.icon}
                </div>
                
                <h3 className={`text-xl font-semibold mb-2 ${
                  isRecommended ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {download.os}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  isRecommended ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {download.description}
                </p>
                
                <a
                  href={download.url}
                  download={download.fileName}
                  className={`inline-flex items-center justify-center w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                    isRecommended
                      ? 'bg-white text-purple-600 hover:bg-gray-100'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </a>
              </div>
            );
          })}
        </div>

        {/* Additional Downloads */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-12">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Other Download Options
          </h3>
          <div className="space-y-2">
            {additionalDownloads.map((download) => (
              <a
                key={download.fileName}
                href={download.url}
                download={download.fileName}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {download.os}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {download.fileName}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              System Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Windows</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 ml-4 list-disc">
                  <li>Windows 10 or later</li>
                  <li>4GB RAM minimum</li>
                  <li>200MB available storage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">macOS</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 ml-4 list-disc">
                  <li>macOS 10.15 Catalina or later</li>
                  <li>4GB RAM minimum</li>
                  <li>200MB available storage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Linux</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 ml-4 list-disc">
                  <li>64-bit distribution</li>
                  <li>4GB RAM minimum</li>
                  <li>200MB available storage</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Installation Instructions
            </h3>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Windows</h4>
                <p>Run the .exe installer and follow the setup wizard.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">macOS</h4>
                <p>Open the .dmg file and drag Soloist Pro to your Applications folder.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Linux</h4>
                <p>Make the AppImage executable (chmod +x) and run it, or install the .deb/.rpm package.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-4">
            Need help? Check out our{' '}
            <a href="/docs" className="text-purple-600 hover:underline">
              documentation
            </a>{' '}
            or{' '}
            <a href="/support" className="text-purple-600 hover:underline">
              contact support
            </a>
          </p>
          <p className="text-sm">
            <a
              href={`https://github.com/${GITHUB_REPO}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              View all releases on GitHub →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 