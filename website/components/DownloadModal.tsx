// DOWNLOAD MODAL
// /Users/matthewsimon/Documents/Github/solopro/website/components/DownloadModal.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Monitor, Apple, Package, Calendar, Brain, BarChart3, Target, Sparkles, Shield, Zap } from "lucide-react";

interface DownloadModalProps {
  children: React.ReactNode;
}

export function DownloadModal({ children }: DownloadModalProps) {
  const downloads = [
    {
      os: 'Windows',
      icon: <Monitor className="w-6 h-6" />,
      description: 'Windows 10 or later (64-bit)',
      buttonText: 'Download for Windows',
      url: 'https://github.com/acdc-digital/solopro/releases/download/v1.6.2/Soloist.Pro-Setup-1.6.2.exe',
    },
    {
      os: 'macOS',
      icon: <Apple className="w-6 h-6" />,
      description: 'macOS 10.15 or later',
      buttonText: 'Download for Mac',
      url: 'https://github.com/acdc-digital/solopro/releases/download/v1.6.2/Soloist.Pro-1.6.2-x64.dmg',
    },
    {
      os: 'Linux',
      icon: <Package className="w-6 h-6" />,
      description: 'AppImage for most distributions',
      buttonText: 'Download for Linux',
      url: 'https://github.com/acdc-digital/solopro/releases/download/v1.6.2/Soloist.Pro-1.6.2.AppImage',
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-none w-[85vw] max-h-[90vh] p-0" style={{ maxWidth: '85vw', width: '85vw' }}>
        <DialogHeader className="pl-6 pt-8 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Download className="h-5 w-5 text-primary" />
            <DialogTitle className="text-2xl font-bold">Download Soloist</DialogTitle>
          </div>
                  <Badge variant="outline" className="w-fit mb-2 border-emerald-500 text-emerald-600 font-medium">
          Version 1.6.1 • Desktop Application
        </Badge>
        </DialogHeader>
        
        <ScrollArea className="px-6 pb-8 max-h-[75vh] w-full">
          <div className="space-y-10 text-sm leading-relaxed">
            
            {/* What is Soloist */}
            <section className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Identify Patterns. Make Better Decisions.</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  Soloist is a dynamic wellness platform that helps you identify self-patterns through daily logging 
                  and AI-powered analysis. At its core, Soloist transforms your personal data into actionable insights, 
                  allowing you to make informed decisions about your life before patterns become problems.
                </p>
              </div>
            </section>

            {/* Download Options */}
            <section className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Download Desktop App</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  Get the full Soloist experience with our native desktop application. Available for all major platforms.
                </p>
              </div>

              <div className="grid gap-4">
                {downloads.map((download) => (
                  <div key={download.os} className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-muted">
                          {download.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{download.os}</h4>
                          <p className="text-sm text-muted-foreground">{download.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open(download.url, '_blank')}
                      >
                        {download.buttonText}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> The desktop app provides the best experience with offline support, 
                  faster performance, and system integration. Web version available at app.soloist.pro
                </p>
              </div>
            </section>

            {/* System Requirements */}
            <section className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">System Requirements</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Windows</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Windows 10 or later</li>
                    <li>• 4GB RAM minimum</li>
                    <li>• 200MB storage</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">macOS</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• macOS 10.15+</li>
                    <li>• 4GB RAM minimum</li>
                    <li>• 200MB storage</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Linux</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 64-bit distribution</li>
                    <li>• 4GB RAM minimum</li>
                    <li>• 200MB storage</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Open Source & Transparent</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  Soloist is proudly developed by ACDC.digital as a for-profit open source project. 
                  We believe in transparency and community collaboration. Your data stays yours, 
                  our code stays open, and together we're building a better way to understand ourselves.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://github.com/acdc-digital/solopro', '_blank')}
                  className="inline-flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/#pricing'}
                >
                  View Pricing
                </Button>
              </div>
            </section>

            {/* Footer */}
            <section className="pt-8 border-t border-border">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                Soloist. | Take control of tomorrow, today.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 