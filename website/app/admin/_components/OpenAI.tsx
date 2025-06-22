"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Cpu, 
  Users,
  Zap,
  AlertTriangle,
  Download
} from "lucide-react";
// Removed date-fns import - using native JS formatting instead

export function OpenAIDashboard() {
  const [timeRange, setTimeRange] = useState(30);
  const stats = useQuery(api.openai.getUsageStats, { timeRange });
  const recentUsage = useQuery(api.openai.getRecentUsage, { limit: 10 });
  const topFeatures = useQuery(api.openai.getTopFeatures, { timeRange, limit: 5 });

  if (!stats || !topFeatures) {
    return <LoadingSkeleton />;
  }

  // Calculate derived metrics
  const avgDailyCost = timeRange > 0 ? stats.totalCost / timeRange : 0;
  const projectedMonthlyCost = avgDailyCost * 30;
  const efficiency = stats.totalTokens > 0 ? stats.totalCost / (stats.totalTokens / 1000) : 0;

  const featureEntries = Object.entries(stats.byFeature) as [string, { cost: number; tokens: number; requests: number }][];
  const modelEntries = Object.entries(stats.byModel) as [string, { cost: number; tokens: number; requests: number }][];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OpenAI Usage Analytics</h1>
          <p className="text-muted-foreground">
            Monitor API usage, costs, and performance across your application
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={timeRange === 7 ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(7)}
          >
            7 days
          </Button>
          <Button
            variant={timeRange === 30 ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(30)}
          >
            30 days
          </Button>
          <Button
            variant={timeRange === 90 ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(90)}
          >
            90 days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Alert for high costs */}
      {projectedMonthlyCost > 100 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-3" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                High Usage Alert
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Projected monthly cost: ${projectedMonthlyCost.toFixed(2)}. Consider optimizing usage.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Last {timeRange} days
            </p>
            <div className="mt-1">
              <Badge variant={projectedMonthlyCost > 100 ? "destructive" : "secondary"}>
                ${projectedMonthlyCost.toFixed(0)}/mo projected
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              API calls made
            </p>
            <div className="mt-1">
              <Badge variant="outline">
                {(stats.totalRequests / timeRange).toFixed(1)}/day avg
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalTokens / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              Tokens processed
            </p>
            <div className="mt-1">
              <Badge variant="outline">
                {(stats.totalTokens / Math.max(stats.totalRequests, 1)).toFixed(0)} avg/request
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Request</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.averageCostPerRequest.toFixed(3)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per API call
            </p>
            <div className="mt-1">
              <Badge variant={efficiency > 0.01 ? "destructive" : "secondary"}>
                ${efficiency.toFixed(4)}/1K tokens
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.byUser).length}</div>
            <p className="text-xs text-muted-foreground">
              Users making requests
            </p>
            <div className="mt-1">
              <Badge variant="outline">
                ${(stats.totalCost / Math.max(Object.keys(stats.byUser).length, 1)).toFixed(2)}/user
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Features by Cost</CardTitle>
            <p className="text-sm text-muted-foreground">
              Most expensive features in your application
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topFeatures.map((feature, index) => (
                <div key={feature.feature} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{feature.feature}</p>
                      <p className="text-sm text-muted-foreground">
                        {feature.requests} requests
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${feature.cost.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      ${feature.avgCostPerRequest.toFixed(3)}/req
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">
              All features with usage statistics
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {featureEntries.map(([feature, data]) => (
                <div key={feature} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{feature.charAt(0).toUpperCase() + feature.slice(1)}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.requests} requests • {(data.tokens / 1000).toFixed(1)}K tokens
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${data.cost.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {((data.cost / stats.totalCost) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Performance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cost efficiency and usage patterns by model
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {modelEntries.map(([model, data]) => (
              <div key={model} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-primary" />
                    <span className="font-medium">{model}</span>
                  </div>
                  <Badge variant="outline">
                    {((data.tokens / stats.totalTokens) * 100).toFixed(1)}% of total tokens
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-right">
                    <p className="font-medium">${data.cost.toFixed(2)}</p>
                    <p className="text-muted-foreground">Total cost</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{data.requests}</p>
                    <p className="text-muted-foreground">Requests</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(data.cost / data.requests).toFixed(3)}</p>
                    <p className="text-muted-foreground">Cost/request</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Requests</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest OpenAI API calls made by your application
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsage?.map((usage) => (
              <div
                key={usage._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-medium">{usage.feature}</span>
                  </div>
                  <Badge variant="outline">{usage.model}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {usage.user?.name || usage.user?.email || "Unknown User"}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">{usage.totalTokens.toLocaleString()}</p>
                    <p className="text-muted-foreground">tokens</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(usage.cost / 100).toFixed(3)}</p>
                    <p className="text-muted-foreground">
                      {new Date(usage.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    </div>
  );
}

export default OpenAIDashboard;
