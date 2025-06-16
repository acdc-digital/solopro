// ADMIN COMPONENT
// /Users/matthewsimon/Documents/Github/solopro/website/components/Admin.tsx

'use client'

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export function Admin() {
  const userSubscriptions = useQuery(api.admin.getAllUserSubscriptions);
  const allUsers = useQuery(api.admin.getAllUsers);
  const isAdmin = useQuery(api.admin.isCurrentUserAdmin);

  if (isAdmin === false) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (isAdmin === undefined || userSubscriptions === undefined || allUsers === undefined) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatCurrency = (amount: number | undefined, currency: string | undefined) => {
    if (!amount || !currency) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Stripe amounts are in cents
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and subscriptions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{allUsers.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Subscriptions</h3>
          <p className="text-3xl font-bold text-green-600">
            {userSubscriptions.filter(sub => sub.status === 'active').length}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Subscriptions</h3>
          <p className="text-3xl font-bold text-purple-600">{userSubscriptions.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-emerald-600">
            {(() => {
              const activeSubscriptions = userSubscriptions.filter(sub => sub.status === 'active');
              const totalRevenue = activeSubscriptions.reduce((sum, sub) => {
                return sum + (sub.paymentAmount || 0);
              }, 0);
              return formatCurrency(totalRevenue, 'usd');
            })()}
          </p>
        </Card>
      </div>

      {/* User Subscriptions Table */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Subscriptions</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Monthly Amount</th>
                  <th className="text-left p-3 font-medium">Subscription ID</th>
                  <th className="text-left p-3 font-medium">Current Period End</th>
                  <th className="text-left p-3 font-medium">Latest Payment</th>
                  <th className="text-left p-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {userSubscriptions.map((subscription) => (
                  <tr key={subscription._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {subscription.userName || 'Unknown User'}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {subscription.userEmail || 'No email'}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm font-semibold">
                      {formatCurrency(subscription.paymentAmount, subscription.paymentCurrency)}
                    </td>
                    <td className="p-3 text-sm font-mono">
                      {subscription.subscriptionId ? 
                        subscription.subscriptionId.substring(0, 20) + '...' : 
                        'N/A'
                      }
                    </td>
                    <td className="p-3 text-sm">
                      {subscription.currentPeriodEnd ? 
                        formatDate(subscription.currentPeriodEnd * 1000) : 
                        'N/A'
                      }
                    </td>
                    <td className="p-3 text-sm">
                      {subscription.latestPaymentDate ? 
                        formatDate(subscription.latestPaymentDate) : 
                        'No payment'
                      }
                    </td>
                    <td className="p-3 text-sm">
                      {formatDate(subscription.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {userSubscriptions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No subscriptions found
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* All Users Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Anonymous</th>
                  <th className="text-left p-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {user.name || 'No name'}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {user.email || 'No email'}
                    </td>
                    <td className="p-3">
                      <Badge className={user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={user.isAnonymous ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {user.isAnonymous ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">
                      {formatDate(user._creationTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}