"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  // If still loading, show a loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard title="Numbers" className="lg:col-span-2">
            <NumbersPanel />
          </DashboardCard>
          <DashboardCard title="Account">
            <ProfilePanel />
          </DashboardCard>
        </div>
      </main>
    </div>
  );
}

function DashboardHeader() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold">SoloPro</h2>
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/dashboard" 
              className="font-medium text-gray-900 dark:text-gray-100"
            >
              Dashboard
            </Link>
            <Link 
              href="/server" 
              className="font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Server Example
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => void signOut().then(() => router.push("/"))}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6"></div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

function DashboardCard({ title, children, className = "" }: DashboardCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function NumbersPanel() {
  const { numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (!numbers) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {numbers.length > 0 ? (
          numbers.map((number: number, index: number) => (
            <span 
              key={index} 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            >
              {number}
            </span>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No numbers yet. Add some!</p>
        )}
      </div>
      <button
        onClick={() => void addNumber({ value: Math.floor(Math.random() * 100) })}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
      >
        Add Random Number
      </button>
    </div>
  );
}

function ProfilePanel() {
  const { viewer } = useQuery(api.myFunctions.listNumbers, { count: 1 }) ?? {};

  if (!viewer) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-full bg-blue-500 w-16 h-16 flex items-center justify-center text-white font-bold text-xl">
        {viewer ? viewer.charAt(0).toUpperCase() : "?"}
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400">Logged in as:</p>
        <p className="font-medium">{viewer || "Anonymous"}</p>
      </div>
    </div>
  );
} 