// OPEN SOURCE
// /Users/matthewsimon/Documents/Github/solopro/website/components/OpenSource.tsx

'use client'

import { Github, FileText, Users, Lock, FileSpreadsheet, ExternalLink } from "lucide-react";
import Link from "next/link";

export function OpenSource() {
  return (
    <section className="py-8 md:py-8 mt-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge and Heading */}
          <div className="space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-sm font-medium text-white">
              <Github className="h-3 w-3" />
              Open Source
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Built Open Source
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Soloist is proudly open source, embracing transparency and collaboration.
              Your wellness journey, built with nothing to hide.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full max-w-4xl">
            <div className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="rounded-full bg-white border border-black p-3 text-black">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-card-foreground">Open Code</h3>
                  <p className="text-sm text-muted-foreground">Fully transparent codebase</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="rounded-full bg-white border border-black p-3 text-black">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-card-foreground">Community-Driven</h3>
                  <p className="text-sm text-muted-foreground">Shaped by user feedback</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="rounded-full bg-white border border-black p-3 text-black">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-card-foreground">Privacy-Focused</h3>
                  <p className="text-sm text-muted-foreground">Your data stays yours</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="rounded-full bg-white border border-black p-3 text-black">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-card-foreground">Transparent Roadmap</h3>
                  <p className="text-sm text-muted-foreground">Openly planned features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <Link
              href="https://github.com/acdc-digital/solopro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Github className="h-4 w-4" />
              View on GitHub
              <ExternalLink className="h-3 w-3" />
            </Link>
            <p className="text-xs text-muted-foreground">
              Star us on GitHub • Contribute • Join the community
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 