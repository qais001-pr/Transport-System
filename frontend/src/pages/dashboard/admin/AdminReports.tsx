import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Car,
  DollarSign,
  Calendar,
  Download,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
} from 'lucide-react';

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const overviewStats = [
    {
      title: 'Total Revenue',
      value: '$125,450',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Users',
      value: '1,089',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Total Trips',
      value: '8,450',
      change: '+15.2%',
      trend: 'up',
      icon: Car,
      color: 'text-secondary',
      bgColor: 'bg-secondary-50',
    },
    {
      title: 'Avg Rating',
      value: '4.7',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 95000, trips: 6200, users: 850, drivers: 120 },
    { month: 'Feb', revenue: 98000, trips: 6500, users: 880, drivers: 125 },
    { month: 'Mar', revenue: 102000, trips: 6800, users: 920, drivers: 130 },
    { month: 'Apr', revenue: 108000, trips: 7100, users: 950, drivers: 135 },
    { month: 'May', revenue: 112000, trips: 7400, users: 980, drivers: 140 },
    { month: 'Jun', revenue: 115000, trips: 7600, users: 1010, drivers: 145 },
    { month: 'Jul', revenue: 118000, trips: 7800, users: 1030, drivers: 148 },
    { month: 'Aug', revenue: 122000, trips: 8100, users: 1050, drivers: 152 },
    { month: 'Sep', revenue: 125450, trips: 8450, users: 1089, drivers: 156 },
  ];

  const driverPerformance = [
    { name: 'John Smith', rating: 4.8, trips: 450, revenue: 28340, onTime: 96 },
    { name: 'Emily Davis', rating: 4.9, trips: 420, revenue: 25600, onTime: 98 },
    { name: 'Michael Brown', rating: 4.7, trips: 380, revenue: 22150, onTime: 94 },
    { name: 'Sarah Williams', rating: 4.2, trips: 250, revenue: 15200, onTime: 88 },
    { name: 'David Wilson', rating: 4.6, trips: 320, revenue: 19800, onTime: 92 },
  ];

  const systemMetrics = [
    { metric: 'System Uptime', value: '99.9%', status: 'excellent', icon: CheckCircle },
    { metric: 'Avg Response Time', value: '1.2s', status: 'good', icon: Clock },
    { metric: 'Active Complaints', value: '8', status: 'warning', icon: AlertTriangle },
    { metric: 'Pending Verifications', value: '23', status: 'warning', icon: FileText },
  ];

  const maxRevenue = Math.max(...monthlyData.map(m => m.revenue));

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar userRole="admin" userName="Admin User" userEmail="admin@vanpooling.com" />

      <div className="flex-1">
        <Header title="Analytics & Reports" subtitle="System performance and business insights" />

        <main className="p-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {overviewStats.map((stat, index) => (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-accent" />
                      )}
                      <span className={stat.trend === 'up' ? 'text-green-600' : 'text-accent'}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-neutral-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Chart */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue and growth trends</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedPeriod === 'month' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod('month')}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={selectedPeriod === 'year' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod('year')}
                  >
                    Yearly
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-neutral-700 w-12">{item.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="relative w-full h-8 bg-neutral-100 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-lg transition-all duration-500"
                            style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                          />
                          <div className="absolute inset-0 flex items-center px-3 text-xs text-neutral-700">
                            ${item.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-neutral-600">
                        <span>{item.trips} trips</span>
                        <span>{item.users} users</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Driver Performance */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Drivers</CardTitle>
                    <CardDescription>Performance leaderboard</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {driverPerformance.map((driver, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-900">{driver.name}</p>
                        <div className="flex items-center gap-3 text-xs text-neutral-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-highlight" />
                            {driver.rating}
                          </span>
                          <span>{driver.trips} trips</span>
                          <span>{driver.onTime}% on-time</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${driver.revenue.toLocaleString()}</p>
                        <p className="text-xs text-neutral-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemMetrics.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.status === 'excellent' ? 'bg-green-100' :
                          item.status === 'good' ? 'bg-secondary-100' :
                          'bg-highlight-100'
                        }`}>
                          <item.icon className={`w-5 h-5 ${
                            item.status === 'excellent' ? 'text-green-600' :
                            item.status === 'good' ? 'text-secondary' :
                            'text-highlight'
                          }`} />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{item.metric}</p>
                          <Badge
                            variant={
                              item.status === 'excellent' ? 'success' :
                              item.status === 'good' ? 'secondary' :
                              'warning'
                            }
                            className="text-xs mt-1"
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-neutral-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
              <CardDescription>Generate and download reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <FileText className="w-8 h-8 text-primary" />
                  <span className="font-semibold">Revenue Report</span>
                  <span className="text-xs text-neutral-500">Monthly breakdown</span>
                </Button>

                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Users className="w-8 h-8 text-secondary" />
                  <span className="font-semibold">User Report</span>
                  <span className="text-xs text-neutral-500">Growth & activity</span>
                </Button>

                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Car className="w-8 h-8 text-highlight" />
                  <span className="font-semibold">Driver Report</span>
                  <span className="text-xs text-neutral-500">Performance metrics</span>
                </Button>

                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <BarChart3 className="w-8 h-8 text-accent" />
                  <span className="font-semibold">Analytics Report</span>
                  <span className="text-xs text-neutral-500">Complete overview</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <Card className="bg-gradient-to-br from-primary to-secondary text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">This Month</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Revenue</span>
                    <span className="text-2xl font-bold">$125,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Growth</span>
                    <span className="text-xl font-bold">+12.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">New Users</span>
                    <span className="text-2xl font-bold">+145</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Total</span>
                    <span className="text-xl font-bold">1,089</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-highlight to-highlight-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Trip Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Total Trips</span>
                    <span className="text-2xl font-bold">8,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">On-Time</span>
                    <span className="text-xl font-bold">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
