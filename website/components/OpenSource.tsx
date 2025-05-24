'use client'

import { Github, FileText, Users, Lock, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export function OpenSource() {
  return (
    <section className="bg-muted py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge and Heading */}
          <div className="space-y-3 mb-6">
            {/* <div className="inline-block rounded-xl bg-primary px-2 py-0.5 text-sm text-primary-foreground">
              Open Source
            </div> */}
            <h2 className="text-2xl font-bold tracking-tighter md:text-3xl/tight">
              Built Open Source
            </h2>
          </div>
          {/* Feature boxes in a row */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-sm">
              <div className="rounded-full bg-primary p-1.5 text-primary-foreground">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold">Open Code</h3>
                <p className="text-xs text-muted-foreground">Fully transparent</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-sm">
              <div className="rounded-full bg-primary p-1.5 text-primary-foreground">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold">Community-Driven</h3>
                <p className="text-xs text-muted-foreground">Shaped by users</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-sm">
              <div className="rounded-full bg-primary p-1.5 text-primary-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold">Privacy-Focused</h3>
                <p className="text-xs text-muted-foreground">Your data stays yours</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-sm">
              <div className="rounded-full bg-primary p-1.5 text-primary-foreground">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold">Transparent Roadmap</h3>
                <p className="text-xs text-muted-foreground">Openly planned</p>
              </div>
            </div>
          </div>
          {/* Description and GitHub button */}
          <div className="space-y-5">
            <p className="text-muted-foreground text-sm md:text-base">
              SoloPro is proudly open source, embracing transparency and collaboration.
            </p>
            <Link
              href="https://github.com/get-convex/convex"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-700 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50"
            >
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 