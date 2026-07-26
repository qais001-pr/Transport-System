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
  Plus,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Users,
  Calendar,
  FileText,
  Settings,
} from 'lucide-react';

export default function AdminVans() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = [
    {
      title: 'Total Vans',
      value: '156',
      subtitle: 'In fleet',
      icon: Car,
      color: 'text-primary',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Active',
      value: '142',
      subtitle: 'Currently operating',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Maintenance',
      value: '8',
      subtitle: 'Under service',
      icon: Settings,
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
    {
      title: 'Inactive',
      value: '6',
      subtitle: 'Not in use',
      icon: XCircle,
      color: 'text-accent',
      bgColor: 'bg-accent-50',
    },
  ];

  const vans = [
    {
      id: 1,
      vanNumber: 'Van #A123',
      licensePlate: 'ABC-1234',
      driver: 'John Smith',
      driverEmail: 'john.smith@email.com',
      capacity: 12,
      currentStudents: 12,
      status: 'active',
      girlsOnly: false,
      registrationDate: '2023-08-20',
      lastMaintenance: '2025-09-15',
      nextMaintenance: '2025-12-15',
      insurance: 'Valid until 2026-08-20',
      routes: 2,
      totalTrips: 450,
    },
    {
      id: 2,
      vanNumber: 'Van #B456',
      licensePlate: 'XYZ-5678',
      driver: 'Sarah Williams',
      driverEmail: 'sarah.w@email.com',
      capacity: 10,
      currentStudents: 8,
      status: 'active',
      girlsOnly: true,
      registrationDate: '2023-10-05',
      lastMaintenance: '2025-08-20',
      nextMaintenance: '2025-11-20',
      insurance: 'Valid until 2026-10-05',
      routes: 1,
      totalTrips: 250,
    },
    {
      id: 3,
      vanNumber: 'Van #C789',
      licensePlate: 'DEF-9012',
      driver: 'Michael Brown',
      driverEmail: 'michael.b@email.com',
      capacity: 15,
      currentStudents: 10,
      status: 'active',
      girlsOnly: false,
      registrationDate: '2023-09-10',
      lastMaintenance: '2025-09-01',
      nextMaintenance: '2025-12-01',
      insurance: 'Valid until 2026-09-10',
      routes: 2,
      totalTrips: 380,
    },
    {
      id: 4,
      vanNumber: 'Van #D012',
      licensePlate: 'GHI-3456',
      driver: 'Robert Lee',
      driverEmail: 'robert.l@email.com',
      capacity: 14,
      currentStudents: 14,
      status: 'maintenance',
      girlsOnly: false,
      registrationDate: '2024-01-15',
      lastMaintenance: '2025-10-05',
      nextMaintenance: '2025-10-20',
      insurance: 'Valid until 2027-01-15',
      routes: 2,
      totalTrips: 180,
      maintenanceReason: 'Scheduled oil change and tire rotation',
    },
    {
      id: 5,
      vanNumber: 'Van #E345',
      licensePlate: 'JKL-7890',
      driver: 'Emily Davis',
      driverEmail: 'emily.d@email.com',
      capacity: 8,
      currentStudents: 8,
      status: 'active',
      girlsOnly: true,
      registrationDate: '2023-07-15',
      lastMaintenance: '2025-08-10',
      nextMaintenance: '2025-11-10',
      insurance: 'Valid until 2026-07-15',
      routes: 1,
      totalTrips: 420,
    },
  ];

  const filteredVans = vans.filter((van) => {
    const matchesSearch = van.vanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         van.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         van.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || van.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success"><CheckCircle className="w-3 h-3" />Active</Badge>;
      case 'maintenance':
        return <Badge variant="warning"><Settings className="w-3 h-3" />Maintenance</Badge>;
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
        <Header title="Van Management" subtitle="Manage fleet vehicles and maintenance" />

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
                  <p className="text-xs text-neutral-500">{stat.subtitle}</p>
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
                      placeholder="Search by van number, driver, or license plate..."
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
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Button variant="primary">
                  <Plus className="w-4 h-4" />
                  Add Van
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vans List */}
          <div className="space-y-4">
            {filteredVans.map((van) => (
              <Card key={van.id} hover>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-neutral-900">{van.vanNumber}</h3>
                            {getStatusBadge(van.status)}
                            {van.girlsOnly && (
                              <Badge variant="danger">
                                <Shield className="w-3 h-3" />
                                Girls Only
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-neutral-600">License: {van.licensePlate}</p>
                        </div>
                      </div>

                      {/* Van Details Grid */}
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs text-neutral-600">Capacity</span>
                          </div>
                          <p className="text-sm font-semibold text-neutral-900">
                            {van.currentStudents}/{van.capacity} students
                          </p>
                          <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-2">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${(van.currentStudents / van.capacity) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Car className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs text-neutral-600">Routes</span>
                          </div>
                          <p className="text-sm font-semibold text-neutral-900">{van.routes} active</p>
                          <p className="text-xs text-neutral-500 mt-1">{van.totalTrips} total trips</p>
                        </div>

                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs text-neutral-600">Registered</span>
                          </div>
                          <p className="text-sm font-semibold text-neutral-900">{van.registrationDate}</p>
                        </div>
                      </div>

                      {/* Driver and Maintenance */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                          <Avatar name={van.driver} size="md" />
                          <div>
                            <p className="text-xs text-neutral-600">Driver</p>
                            <p className="text-sm font-semibold text-neutral-900">{van.driver}</p>
                            <p className="text-xs text-neutral-500">{van.driverEmail}</p>
                          </div>
                        </div>

                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Settings className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs text-neutral-600">Maintenance</span>
                          </div>
                          <p className="text-xs text-neutral-600">Last: {van.lastMaintenance}</p>
                          <p className="text-xs text-neutral-600">Next: {van.nextMaintenance}</p>
                        </div>
                      </div>

                      {/* Maintenance Reason */}
                      {van.maintenanceReason && (
                        <div className="mt-4 p-3 bg-highlight-50 rounded-lg border border-highlight-200">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-highlight flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900">Under Maintenance</p>
                              <p className="text-sm text-neutral-700">{van.maintenanceReason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Insurance */}
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <p className="text-sm text-green-700">Insurance: {van.insurance}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="lg:w-48 flex flex-col gap-2">
                      <Button variant="primary" size="sm" className="w-full">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4" />
                        Edit Van
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="w-4 h-4" />
                        Documents
                      </Button>
                      {van.status === 'active' && (
                        <Button variant="outline" size="sm" className="w-full text-highlight hover:bg-highlight-50">
                          <Settings className="w-4 h-4" />
                          Schedule Maintenance
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="w-full text-accent hover:bg-accent-50">
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
