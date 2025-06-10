// OPEN SOURCE
// /Users/matthewsimon/Documents/Github/solopro/website/components/OpenSource.tsx

'use client'

import { Github, FileText, Users, Lock, FileSpreadsheet, ExternalLink } from "lucide-react";
import Link from "next/link";

export function OpenSource() {
  return (
    <section className="py-6 md:py-8 mt-2 md:mt-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge and Heading */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs md:text-sm font-medium text-black border border-black">
              <Github className="h-3 w-3" />
              Open Source
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-4xl px-2">
              Built Open Source
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              Soloist is proudly open source, embracing transparency and collaboration.
              <span className="block sm:inline"> Your wellness journey, built with nothing to hide.</span>
            </p>
          </div>

          {/* Feature Grid - Mobile optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 w-full max-w-4xl">
            <div className="bg-card rounded-lg border border-border p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                <div className="rounded-full bg-white border border-black p-2 md:p-3 text-black">
                  <FileText className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-card-foreground">Open Code</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Fully transparent codebase</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                <div className="rounded-full bg-white border border-black p-2 md:p-3 text-black">
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-card-foreground">Community-Driven</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Shaped by user feedback</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                <div className="rounded-full bg-white border border-black p-2 md:p-3 text-black">
                  <Lock className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-card-foreground">Privacy-Focused</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Your data stays yours</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                <div className="rounded-full bg-white border border-black p-2 md:p-3 text-black">
                  <FileSpreadsheet className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-card-foreground">Transparent Roadmap</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Openly planned features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action - Mobile optimized */}
          <div className="space-y-3 md:space-y-4">
            <Link
              href="https://github.com/acdc-digital/solopro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-500 px-5 md:px-6 py-2.5 md:py-3 text-sm font-semibold text-white shadow-sm hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
            >
              <Github className="h-4 w-4" />
              View on GitHub
              <ExternalLink className="h-3 w-3" />
            </Link>
            <p className="text-xs text-muted-foreground px-4">
              <span className="block sm:inline">Star us on GitHub</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">Contribute</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">Join the community</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}