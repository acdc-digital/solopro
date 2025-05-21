'use client'

import { Github, FileText, Users, Lock, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export function OpenSource() {
  return (
    <section className="bg-muted py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Open Source
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Built on Open Source. Backed by Community.
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                SoloPro is proudly open source, embracing transparency and collaboration.
                We believe in building technology that&apos;s accountable to its users and community.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="https://github.com/get-convex/convex"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 shadow-sm">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-center text-xl font-bold">Open Code</h3>
              <p className="text-center text-sm text-muted-foreground">
                Fully transparent codebase
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 shadow-sm">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-center text-xl font-bold">Community-Driven</h3>
              <p className="text-center text-sm text-muted-foreground">
                Shaped by our users
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 shadow-sm">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-center text-xl font-bold">Privacy-Focused</h3>
              <p className="text-center text-sm text-muted-foreground">
                Your data stays yours
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 shadow-sm">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="text-center text-xl font-bold">Transparent Roadmap</h3>
              <p className="text-center text-sm text-muted-foreground">
                Openly planned future
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 