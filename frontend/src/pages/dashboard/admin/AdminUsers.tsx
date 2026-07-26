import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Mail,
  Phone,
  Calendar,
  Shield,
  Car,
} from 'lucide-react';

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+45 this month',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Parents',
      value: '856',
      change: '69% of total',
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary-50',
    },
    {
      title: 'Drivers',
      value: '156',
      change: '13% of total',
      icon: Car,
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
    {
      title: 'Active Users',
      value: '1,089',
      change: '88% active',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const users = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      role: 'parent',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      children: 2,
      bookings: 2,
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 234-5678',
      role: 'driver',
      status: 'active',
      joinDate: '2023-08-20',
      lastActive: '1 hour ago',
      students: 12,
      routes: 2,
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: '+1 (555) 345-6789',
      role: 'driver',
      status: 'active',
      joinDate: '2023-09-10',
      lastActive: '3 hours ago',
      students: 10,
      routes: 2,
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      phone: '+1 (555) 456-7890',
      role: 'parent',
      status: 'active',
      joinDate: '2024-02-01',
      lastActive: '1 day ago',
      children: 1,
      bookings: 1,
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.w@email.com',
      phone: '+1 (555) 567-8901',
      role: 'parent',
      status: 'inactive',
      joinDate: '2023-12-15',
      lastActive: '2 weeks ago',
      children: 1,
      bookings: 0,
    },
    {
      id: 6,
      name: 'Guard Smith',
      email: 'guard.s@school.com',
      phone: '+1 (555) 678-9012',
      role: 'guard',
      status: 'active',
      joinDate: '2023-07-01',
      lastActive: '30 mins ago',
      school: 'Lincoln Elementary',
    },
    {
      id: 7,
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+1 (555) 789-0123',
      role: 'driver',
      status: 'suspended',
      joinDate: '2023-10-05',
      lastActive: '1 week ago',
      students: 0,
      routes: 0,
      rating: 4.2,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const badges = {
      parent: { variant: 'primary' as const, label: 'Parent' },
      driver: { variant: 'secondary' as const, label: 'Driver' },
      guard: { variant: 'warning' as const, label: 'Guard' },
      admin: { variant: 'danger' as const, label: 'Admin' },
    };
    return badges[role as keyof typeof badges] || badges.parent;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success"><CheckCircle className="w-3 h-3" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><XCircle className="w-3 h-3" />Inactive</Badge>;
      case 'suspended':
        return <Badge variant="danger"><Ban className="w-3 h-3" />Suspended</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar userRole="admin" userName="Admin User" userEmail="admin@vanpooling.com" />

      <div className="flex-1">
        <Header title="User Management" subtitle="Manage all system users and their permissions" />

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

          {/* Filters and Actions */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="parent">Parents</option>
                  <option value="driver">Drivers</option>
                  <option value="guard">Guards</option>
                  <option value="admin">Admins</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <Button variant="primary">
                  <UserPlus className="w-4 h-4" />
                  Add User
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    Showing {filteredUsers.length} of {users.length} users
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">User</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Contact</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Details</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Joined</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} size="md" />
                            <div>
                              <p className="font-semibold text-neutral-900">{user.name}</p>
                              <p className="text-xs text-neutral-500">Last active: {user.lastActive}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-neutral-700">
                              <Mail className="w-3 h-3 text-neutral-500" />
                              <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-700">
                              <Phone className="w-3 h-3 text-neutral-500" />
                              <span>{user.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={getRoleBadge(user.role).variant}>
                            {getRoleBadge(user.role).label}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-neutral-700">
                            {user.role === 'parent' && (
                              <>
                                <p>{user.children} children</p>
                                <p className="text-xs text-neutral-500">{user.bookings} bookings</p>
                              </>
                            )}
                            {user.role === 'driver' && (
                              <>
                                <p>{user.students} students</p>
                                <p className="text-xs text-neutral-500">Rating: {user.rating}⭐</p>
                              </>
                            )}
                            {user.role === 'guard' && (
                              <p className="text-xs text-neutral-500">{user.school}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Calendar className="w-3 h-3" />
                            <span>{user.joinDate}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {user.status === 'active' && (
                              <Button variant="ghost" size="sm" className="text-accent hover:bg-accent-50">
                                <Ban className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="text-accent hover:bg-accent-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
