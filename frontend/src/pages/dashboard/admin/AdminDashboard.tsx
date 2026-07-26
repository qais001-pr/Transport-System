import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Bus,
  Route,
  MapPin,
  Settings,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  Shield,
  Star,
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary-50',
    },
    {
      title: 'Active Drivers',
      value: '89',
      change: '+5%',
      icon: Bus,
      color: 'text-primary',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Active Routes',
      value: '156',
      change: '+8%',
      icon: Route,
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
    {
      title: 'System Health',
      value: '98.5%',
      change: '+0.2%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'verification',
      message: 'New driver verification request from John Smith',
      time: '2 minutes ago',
      status: 'pending',
      priority: 'high',
    },
    {
      id: 2,
      type: 'complaint',
      message: 'Route delay reported on Route A123',
      time: '15 minutes ago',
      status: 'urgent',
      priority: 'high',
    },
    {
      id: 3,
      type: 'registration',
      message: 'New parent registration: Sarah Johnson',
      time: '1 hour ago',
      status: 'completed',
      priority: 'normal',
    },
    {
      id: 4,
      type: 'payment',
      message: 'Monthly payment processed for 245 parents',
      time: '3 hours ago',
      status: 'completed',
      priority: 'normal',
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Driver License Expiry',
      message: '5 drivers have licenses expiring within 30 days',
      action: 'Review',
    },
    {
      id: 2,
      type: 'info',
      title: 'System Update',
      message: 'New features available in v2.1.0',
      action: 'Update',
    },
    {
      id: 3,
      type: 'error',
      title: 'Payment Failure',
      message: '3 monthly payments failed processing',
      action: 'Resolve',
    },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar userRole="admin" userName="Admin User" userEmail="admin@vanpooling.com" />

      <div className="flex-1">
        <Header title="Admin Dashboard" subtitle="System overview and management controls" />

        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <Badge variant="success" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-neutral-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest system activities and updates</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            activity.status === 'completed'
                              ? 'bg-green-100'
                              : activity.status === 'pending'
                              ? 'bg-highlight-100'
                              : activity.status === 'urgent'
                              ? 'bg-accent-100'
                              : 'bg-neutral-100'
                          }`}
                        >
                          {activity.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : activity.status === 'pending' ? (
                            <Clock className="w-4 h-4 text-highlight-600" />
                          ) : activity.status === 'urgent' ? (
                            <AlertTriangle className="w-4 h-4 text-accent-600" />
                          ) : (
                            <Settings className="w-4 h-4 text-neutral-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-sm text-neutral-900 font-medium">{activity.message}</p>
                            {activity.priority === 'high' && (
                              <Badge variant="danger" className="text-xs">
                                High Priority
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Overview */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>Current system status and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-600">Active Routes Today</span>
                          <span className="text-lg font-bold text-neutral-900">89</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-secondary h-2 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-600">Driver Utilization</span>
                          <span className="text-lg font-bold text-neutral-900">82%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '82%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-600">Payment Success Rate</span>
                          <span className="text-lg font-bold text-neutral-900">96.5%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-highlight h-2 rounded-full" style={{ width: '96%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-600">On-Time Performance</span>
                          <span className="text-lg font-bold text-neutral-900">94.2%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Alerts */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>Important notifications requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemAlerts.map((alert) => (
                      <div key={alert.id} className="p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-start gap-3 mb-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              alert.type === 'error'
                                ? 'bg-accent-100'
                                : alert.type === 'warning'
                                ? 'bg-highlight-100'
                                : 'bg-secondary-100'
                            }`}
                          >
                            {alert.type === 'error' ? (
                              <AlertTriangle className="w-4 h-4 text-accent-600" />
                            ) : alert.type === 'warning' ? (
                              <Shield className="w-4 h-4 text-highlight-600" />
                            ) : (
                              <Settings className="w-4 h-4 text-secondary-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-neutral-900 text-sm">{alert.title}</h4>
                            <p className="text-xs text-neutral-600 mt-1">{alert.message}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          {alert.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4" />
                      Manage Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bus className="w-4 h-4" />
                      Driver Verifications
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Route className="w-4 h-4" />
                      Route Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4" />
                      View Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4" />
                      System Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
