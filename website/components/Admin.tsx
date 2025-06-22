// ADMIN COMPONENT
// /Users/matthewsimon/Documents/Github/solopro/website/components/Admin.tsx

'use client'

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import {
  BarChart3,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  Calendar,
  UserCheck,
  AlertCircle,
  ChevronRight,
  LayoutDashboard,
  TrendingDown,
  Percent,
  Target,
  Download,
  User,
  Loader2,
  LogOut
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthActions } from "@convex-dev/auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useConvexUser } from "../lib/hooks/useConvexUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ProfileModal } from "../modals/ProfileModal";
import { SignInModal } from "../modals/SignInModal";
import { OpenAIDashboard } from "../app/admin/_components/OpenAI";

export function Admin() {
  const userSubscriptions = useQuery(api.admin.getAllUserSubscriptions);
  const allUsers = useQuery(api.admin.getAllUsers);
  const isAdmin = useQuery(api.admin.isCurrentUserAdmin);
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'subscriptions' | 'analytics' | 'openai'>('overview');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Auth and user info for navbar
  const { isAuthenticated, isLoading, userId } = useConvexUser();
  const { signOut } = useAuthActions();

  // Get user details
  const user = useQuery(
    api.users.viewer,
    isAuthenticated && userId ? {} : "skip"
  );

  // Get user initials for avatar fallback
  const userInitials = useMemo(() => {
    if (!user?.name) return "U";
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].substring(0, 1).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }, [user?.name]);

  const handleDirectDownload = () => {
    const downloadUrl = 'https://github.com/acdc-digital/solopro/releases/download/v1.6.5/Soloist.Pro-1.6.5-x64.dmg';

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-96">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
            <CardDescription>You don&apos;t have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isAdmin === undefined || userSubscriptions === undefined || allUsers === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number | undefined, currency: string | undefined) => {
    if (!amount || !currency) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'canceled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'trial':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Calculate enhanced metrics
  const activeSubscriptions = userSubscriptions.filter(sub => sub.status === 'active');
  const canceledSubscriptions = userSubscriptions.filter(sub => sub.status === 'canceled');
  const trialSubscriptions = userSubscriptions.filter(sub => sub.status === 'trial');
  const totalMonthlyRevenue = activeSubscriptions.reduce((sum, sub) => sum + (sub.paymentAmount || 0), 0);
  const averageRevenuePerUser = activeSubscriptions.length > 0 ? totalMonthlyRevenue / activeSubscriptions.length : 0;
  const churnRate = userSubscriptions.length > 0 ? (canceledSubscriptions.length / userSubscriptions.length) * 100 : 0;
  const conversionRate = allUsers.length > 0 ? (activeSubscriptions.length / allUsers.length) * 100 : 0;
  const registeredUsers = allUsers.filter(u => !u.isAnonymous).length;
  const anonymousUsers = allUsers.filter(u => u.isAnonymous).length;

  // Growth simulation (you can replace with real data)
  const monthlyGrowthRate = 12.5; // Example growth rate
  const projectedAnnualRevenue = totalMonthlyRevenue * 12 * (1 + monthlyGrowthRate / 100);

  // Sidebar navigation items
  const sidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: CreditCard,
    },
    {
      id: 'openai',
      label: 'LLM Usage',
      icon: DollarSign,
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50/50">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/65">
        <div className="flex items-center justify-between h-16 pl-6 pr-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/solologo.svg"
                alt="SoloPro Logo"
                width={40}
                height={40}
                className="w-8 h-8"
              />
            </Link>
            <span className="text-3xl font-bold text-foreground">
              Soloist.
            </span>
          </div>

          {/* Admin Badge */}
          <div className="flex items-center gap-4">
            {/* User Avatar Dropdown */}
            {isLoading ? (
              <Button disabled variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                      <AvatarFallback className="text-sm bg-white border border-black hover:bg-zinc-200 text-zinc-700">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDirectDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Desktop App
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Admin</h2>
            <p className="text-sm text-gray-500 mt-1">Dashboard</p>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeView === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeView === item.id && "bg-gray-100 text-gray-900"
                )}
                onClick={() => setActiveView(item.id as 'overview' | 'users' | 'subscriptions' | 'analytics' | 'openai')}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-8">
              {activeView === 'overview' && (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Monitor your business metrics and performance</p>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Monthly Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(totalMonthlyRevenue, 'usd')}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          From {activeSubscriptions.length} active subscriptions
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{allUsers.length}</div>
                        <p className="text-xs text-gray-500 mt-1">
                          {registeredUsers} registered • {anonymousUsers} anonymous
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Conversion Rate
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {conversionRate.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Users to paid subscribers
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Avg Revenue/User
                        </CardTitle>
                        <Activity className="h-4 w-4 text-orange-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(averageRevenuePerUser, 'usd')}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Per active subscription
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Business Insights Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Subscription Status */}
                    <Card className="border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">Subscription Status</CardTitle>
                        <CardDescription>Current subscription distribution</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                            <span className="text-sm">Active</span>
                          </div>
                          <span className="font-semibold">{activeSubscriptions.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm">Trial</span>
                          </div>
                          <span className="font-semibold">{trialSubscriptions.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <span className="text-sm">Canceled</span>
                          </div>
                          <span className="font-semibold">{canceledSubscriptions.length}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Financial Health */}
                    <Card className="border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">Financial Health</CardTitle>
                        <CardDescription>Key financial indicators</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Churn Rate</span>
                            <span className="font-semibold">{churnRate.toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 transition-all"
                              style={{ width: `${Math.min(churnRate, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Growth Rate</span>
                            <span className="font-semibold text-emerald-600">+{monthlyGrowthRate}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all"
                              style={{ width: `${monthlyGrowthRate}%` }}
                            />
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Projected Annual</span>
                            <span className="font-semibold text-blue-600">
                              {formatCurrency(projectedAnnualRevenue, 'usd')}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                        <CardDescription>Latest subscription changes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {userSubscriptions.slice(0, 4).map((sub) => (
                            <div key={sub._id} className="flex items-center gap-3 text-sm">
                              <div className={cn("h-2 w-2 rounded-full", {
                                "bg-emerald-500": sub.status === 'active',
                                "bg-red-500": sub.status === 'canceled',
                                "bg-blue-500": sub.status === 'trial'
                              })} />
                              <span className="flex-1 truncate">{sub.userName || 'Unknown'}</span>
                              <Badge variant="outline" className={cn("text-xs", getStatusColor(sub.status))}>
                                {sub.status}
                              </Badge>
                            </div>
                          ))}
                          {userSubscriptions.length === 0 && (
                            <p className="text-gray-500 text-sm">No recent activity</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {activeView === 'analytics' && (
                <>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
                    <p className="text-gray-600 mt-1">Deep dive into your financial performance</p>
                  </div>

                  {/* Advanced Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="border-gray-200">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Churn Rate
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {churnRate.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {churnRate < 5 ? 'Excellent retention' : churnRate < 10 ? 'Good retention' : 'Needs improvement'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Lifetime Value
                        </CardTitle>
                        <Target className="h-4 w-4 text-purple-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(averageRevenuePerUser * 12, 'usd')}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Estimated annual value per user
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Trial Conversion
                        </CardTitle>
                        <Percent className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {trialSubscriptions.length > 0 ? 
                            ((activeSubscriptions.length / (activeSubscriptions.length + trialSubscriptions.length)) * 100).toFixed(1) 
                            : '0'
                          }%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Trial to paid conversion rate
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
                        <CardDescription>Monthly revenue analysis</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Active Subscriptions</span>
                          <span className="font-semibold">{formatCurrency(totalMonthlyRevenue, 'usd')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Projected Growth</span>
                          <span>+{formatCurrency(totalMonthlyRevenue * (monthlyGrowthRate / 100), 'usd')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Potential Churn Loss</span>
                          <span className="text-red-600">-{formatCurrency(totalMonthlyRevenue * (churnRate / 100), 'usd')}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Net Projected</span>
                            <span className="text-emerald-600">
                              {formatCurrency(totalMonthlyRevenue * (1 + (monthlyGrowthRate - churnRate) / 100), 'usd')}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">User Segments</CardTitle>
                        <CardDescription>User distribution analysis</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Paying Customers</span>
                          <span className="font-semibold">{activeSubscriptions.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trial Users</span>
                          <span className="font-semibold">{trialSubscriptions.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Free Users</span>
                          <span className="font-semibold">{allUsers.length - userSubscriptions.length}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Churned Users</span>
                          <span>{canceledSubscriptions.length}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {activeView === 'users' && (
                <>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                    <p className="text-gray-600 mt-1">View and manage all registered users</p>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left p-4 font-medium text-gray-900">User</th>
                              <th className="text-left p-4 font-medium text-gray-900">Email</th>
                              <th className="text-left p-4 font-medium text-gray-900">Role</th>
                              <th className="text-left p-4 font-medium text-gray-900">Type</th>
                              <th className="text-left p-4 font-medium text-gray-900">Joined</th>
                              <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {allUsers.map((user) => (
                              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <UserCheck className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <span className="font-medium">{user.name || 'No name'}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-gray-600">
                                  {user.email || 'No email'}
                                </td>
                                <td className="p-4">
                                  <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                                    {user.role}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <Badge variant="outline" className={user.isAnonymous ? 'border-yellow-500 text-yellow-700' : 'border-emerald-500 text-emerald-700'}>
                                    {user.isAnonymous ? 'Anonymous' : 'Registered'}
                                  </Badge>
                                </td>
                                <td className="p-4 text-gray-600">
                                  {formatDate(user._creationTime)}
                                </td>
                                <td className="p-4">
                                  <Button variant="ghost" size="sm">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeView === 'subscriptions' && (
                <>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
                    <p className="text-gray-600 mt-1">Track and manage all user subscriptions</p>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left p-4 font-medium text-gray-900">Customer</th>
                              <th className="text-left p-4 font-medium text-gray-900">Status</th>
                              <th className="text-left p-4 font-medium text-gray-900">Amount</th>
                              <th className="text-left p-4 font-medium text-gray-900">Next Billing</th>
                              <th className="text-left p-4 font-medium text-gray-900">Last Payment</th>
                              <th className="text-left p-4 font-medium text-gray-900">Created</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {userSubscriptions.map((subscription) => (
                              <tr key={subscription._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                  <div>
                                    <div className="font-medium">{subscription.userName || 'Unknown User'}</div>
                                    <div className="text-sm text-gray-600">{subscription.userEmail}</div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge className={getStatusColor(subscription.status)}>
                                    {subscription.status}
                                  </Badge>
                                </td>
                                <td className="p-4 font-semibold">
                                  {formatCurrency(subscription.paymentAmount, subscription.paymentCurrency)}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">
                                      {subscription.currentPeriodEnd ? 
                                        formatDate(subscription.currentPeriodEnd * 1000) : 
                                        'N/A'
                                      }
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                  {subscription.latestPaymentDate ? 
                                    formatDate(subscription.latestPaymentDate) : 
                                    'No payment'
                                  }
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                  {formatDate(subscription.createdAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {userSubscriptions.length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No subscriptions found</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeView === 'openai' && <OpenAIDashboard />}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />

      {/* Security/Password Reset Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        initialFlow="forgotPassword"
        onAuthSuccess={() => setIsSignInModalOpen(false)}
      />
    </div>
  );
}