import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Car,
  Search,
  Star,
  Users,
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  Edit,
  Shield,
  FileText,
  TrendingUp,
  AlertTriangle,
  Download,
} from 'lucide-react';

export default function AdminDrivers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = [
    {
      title: 'Total Drivers',
      value: '156',
      change: '+12 this month',
      icon: Car,
      color: 'text-primary',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Active Drivers',
      value: '142',
      change: '91% active',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Avg Rating',
      value: '4.7',
      change: '+0.2 this month',
      icon: Star,
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
    {
      title: 'Pending Verification',
      value: '8',
      change: 'Needs review',
      icon: Shield,
      color: 'text-accent',
      bgColor: 'bg-accent-50',
    },
  ];

  const drivers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 234-5678',
      vanNumber: 'Van #A123',
      license: 'DL-12345678',
      status: 'active',
      verified: true,
      rating: 4.8,
      totalReviews: 120,
      students: 12,
      routes: 2,
      totalTrips: 450,
      onTimeRate: 96,
      joinDate: '2023-08-20',
      earnings: 28340,
    },
    {
      id: 2,
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: '+1 (555) 345-6789',
      vanNumber: 'Van #C789',
      license: 'DL-23456789',
      status: 'active',
      verified: true,
      rating: 4.7,
      totalReviews: 85,
      students: 10,
      routes: 2,
      totalTrips: 380,
      onTimeRate: 94,
      joinDate: '2023-09-10',
      earnings: 22150,
    },
    {
      id: 3,
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+1 (555) 789-0123',
      vanNumber: 'Van #B456',
      license: 'DL-34567890',
      status: 'suspended',
      verified: true,
      rating: 4.2,
      totalReviews: 65,
      students: 0,
      routes: 0,
      totalTrips: 250,
      onTimeRate: 88,
      joinDate: '2023-10-05',
      earnings: 15200,
      suspensionReason: 'Multiple complaints',
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.w@email.com',
      phone: '+1 (555) 456-7890',
      vanNumber: 'Van #D012',
      license: 'DL-45678901',
      status: 'pending',
      verified: false,
      rating: 0,
      totalReviews: 0,
      students: 0,
      routes: 0,
      totalTrips: 0,
      onTimeRate: 0,
      joinDate: '2025-10-08',
      earnings: 0,
    },
    {
      id: 5,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 567-8901',
      vanNumber: 'Van #E345',
      license: 'DL-56789012',
      status: 'active',
      verified: true,
      rating: 4.9,
      totalReviews: 110,
      students: 8,
      routes: 1,
      totalTrips: 420,
      onTimeRate: 98,
      joinDate: '2023-07-15',
      earnings: 25600,
    },
  ];

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         driver.vanNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success"><CheckCircle className="w-3 h-3" />Active</Badge>;
      case 'pending':
        return <Badge variant="warning"><AlertTriangle className="w-3 h-3" />Pending</Badge>;
      case 'suspended':
        return <Badge variant="danger"><Ban className="w-3 h-3" />Suspended</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><XCircle className="w-3 h-3" />Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar userRole="admin" userName="Admin User" userEmail="admin@vanpooling.com" />

      <div className="flex-1">
        <Header title="Driver Management" subtitle="Manage drivers, verifications, and performance" />

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
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-neutral-600">{stat.title}</p>
                  <p className="text-xs text-neutral-500">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or van number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drivers List */}
          <div className="space-y-4">
            {filteredDrivers.map((driver) => (
              <Card key={driver.id} hover>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section - Driver Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar name={driver.name} size="xl" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-neutral-900">{driver.name}</h3>
                            {getStatusBadge(driver.status)}
                            {driver.verified && (
                              <Badge variant="success">
                                <Shield className="w-3 h-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-neutral-600">
                            <p>{driver.email}</p>
                            <p>{driver.phone}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="font-semibold text-primary">{driver.vanNumber}</span>
                              <span>License: {driver.license}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-highlight" />
                            <span className="text-xs text-neutral-600">Rating</span>
                          </div>
                          <p className="text-lg font-bold text-neutral-900">
                            {driver.rating > 0 ? driver.rating : 'N/A'}
                          </p>
                          {driver.totalReviews > 0 && (
                            <p className="text-xs text-neutral-500">{driver.totalReviews} reviews</p>
                          )}
                        </div>

                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-secondary" />
                            <span className="text-xs text-neutral-600">Students</span>
                          </div>
                          <p className="text-lg font-bold text-neutral-900">{driver.students}</p>
                          <p className="text-xs text-neutral-500">{driver.routes} routes</p>
                        </div>

                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-neutral-600">On-Time</span>
                          </div>
                          <p className="text-lg font-bold text-neutral-900">
                            {driver.onTimeRate > 0 ? `${driver.onTimeRate}%` : 'N/A'}
                          </p>
                          <p className="text-xs text-neutral-500">{driver.totalTrips} trips</p>
                        </div>

                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-xs text-neutral-600">Earnings</span>
                          </div>
                          <p className="text-lg font-bold text-neutral-900">
                            ${driver.earnings.toLocaleString()}
                          </p>
                          <p className="text-xs text-neutral-500">Total earned</p>
                        </div>
                      </div>

                      {/* Suspension Reason */}
                      {driver.status === 'suspended' && driver.suspensionReason && (
                        <div className="mt-4 p-3 bg-accent-50 rounded-lg border border-accent-200">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900">Suspended</p>
                              <p className="text-sm text-neutral-700">Reason: {driver.suspensionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Section - Actions */}
                    <div className="lg:w-48 flex flex-col gap-2">
                      <Button variant="primary" size="sm" className="w-full">
                        <Eye className="w-4 h-4" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4" />
                        Edit Details
                      </Button>

                      {driver.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" className="w-full text-green-600 hover:bg-green-50">
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="w-full text-accent hover:bg-accent-50">
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}

                      {driver.status === 'active' && (
                        <Button variant="outline" size="sm" className="w-full text-accent hover:bg-accent-50">
                          <Ban className="w-4 h-4" />
                          Suspend
                        </Button>
                      )}

                      {driver.status === 'suspended' && (
                        <Button variant="outline" size="sm" className="w-full text-green-600 hover:bg-green-50">
                          <CheckCircle className="w-4 h-4" />
                          Reactivate
                        </Button>
                      )}

                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="w-4 h-4" />
                        Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredDrivers.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Car className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No drivers found</h3>
                <p className="text-neutral-600">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
