import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Navigation,
  Search,
  MapPin,
  Users,
  Clock,
  School,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function AdminRoutes() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    {
      title: 'Total Routes',
      value: '48',
      subtitle: 'Active routes',
      icon: Navigation,
      color: 'text-primary',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Total Stops',
      value: '384',
      subtitle: 'Pickup points',
      icon: MapPin,
      color: 'text-secondary',
      bgColor: 'bg-secondary-50',
    },
    {
      title: 'Students',
      value: '856',
      subtitle: 'Being transported',
      icon: Users,
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
    {
      title: 'Schools',
      value: '12',
      subtitle: 'Covered',
      icon: School,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const routes = [
    {
      id: 1,
      name: 'Route A - Morning Pickup',
      driver: 'John Smith',
      vanNumber: 'Van #A123',
      school: 'Lincoln Elementary School',
      type: 'pickup',
      startTime: '7:00 AM',
      endTime: '8:30 AM',
      stops: 8,
      students: 12,
      distance: '15.2 km',
      status: 'active',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    {
      id: 2,
      name: 'Route A - Afternoon Drop',
      driver: 'John Smith',
      vanNumber: 'Van #A123',
      school: 'Lincoln Elementary School',
      type: 'dropoff',
      startTime: '2:30 PM',
      endTime: '4:00 PM',
      stops: 8,
      students: 12,
      distance: '15.2 km',
      status: 'active',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    {
      id: 3,
      name: 'Route B - Morning Pickup',
      driver: 'Michael Brown',
      vanNumber: 'Van #C789',
      school: 'Washington Elementary',
      type: 'pickup',
      startTime: '7:15 AM',
      endTime: '8:45 AM',
      stops: 6,
      students: 10,
      distance: '12.8 km',
      status: 'active',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    {
      id: 4,
      name: 'Route C - Morning Pickup',
      driver: 'Sarah Williams',
      vanNumber: 'Van #B456',
      school: 'Jefferson High School',
      type: 'pickup',
      startTime: '6:45 AM',
      endTime: '8:15 AM',
      stops: 10,
      students: 15,
      distance: '18.5 km',
      status: 'inactive',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
  ];

  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar userRole="admin" userName="Admin User" userEmail="admin@vanpooling.com" />

      <div className="flex-1">
        <Header title="Route Management" subtitle="Manage and optimize transportation routes" />

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

          {/* Search and Actions */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search routes by name, driver, or school..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <Button variant="primary">
                  <Plus className="w-4 h-4" />
                  Create Route
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Routes List */}
          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <Card key={route.id} hover>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-neutral-900">{route.name}</h3>
                            <Badge variant={route.type === 'pickup' ? 'primary' : 'secondary'}>
                              {route.type === 'pickup' ? 'Pickup' : 'Drop-off'}
                            </Badge>
                            <Badge variant={route.status === 'active' ? 'success' : 'secondary'}>
                              {route.status === 'active' ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-neutral-600 flex items-center gap-2">
                            <School className="w-4 h-4" />
                            {route.school}
                          </p>
                        </div>
                      </div>

                      {/* Route Details Grid */}
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs text-neutral-600">Time</span>
                          </div>
                          <p className="text-sm font-semibold text-neutral-900">
                            {route.startTime} - {route.endTime}
                          </p>
                        </div>

                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs text-neutral-600">Stops</span>
                          </div>
                          <p className="text-sm font-semibold text-neutral-900">{route.stops} locations</p>
                        </div>

                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs text-neutral-600">Students</span>
                          </div>
                          <p className="text-sm font-semibold text-neutral-900">{route.students} children</p>
                        </div>

                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Navigation className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs text-neutral-600">Distance</span>
                          </div>
                          <p className="text-sm font-semibold text-neutral-900">{route.distance}</p>
                        </div>
                      </div>

                      {/* Driver and Days */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={route.driver} size="sm" />
                          <div>
                            <p className="text-xs text-neutral-600">Driver</p>
                            <p className="text-sm font-semibold text-neutral-900">{route.driver}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 mb-1">Active Days</p>
                          <div className="flex gap-1">
                            {route.days.map((day) => (
                              <Badge key={day} variant="secondary" className="text-xs">
                                {day}
                              </Badge>
                            ))}
                          </div>
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
                        Edit Route
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <MapPin className="w-4 h-4" />
                        View Map
                      </Button>
                      <Button variant="outline" size="sm" className="w-full text-accent hover:bg-accent-50">
                        <Trash2 className="w-4 h-4" />
                        Delete
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
