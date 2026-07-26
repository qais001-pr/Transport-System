import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  User,
  Car,
  Calendar,
  Flag,
} from 'lucide-react';

export default function AdminComplaints() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);

  const stats = [
    {
      title: 'Total Complaints',
      value: '45',
      subtitle: 'All time',
      icon: AlertTriangle,
      color: 'text-accent',
      bgColor: 'bg-accent-50',
    },
    {
      title: 'Open',
      value: '8',
      subtitle: 'Needs attention',
      icon: Clock,
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
    {
      title: 'Investigating',
      value: '5',
      subtitle: 'In progress',
      icon: Search,
      color: 'text-secondary',
      bgColor: 'bg-secondary-50',
    },
    {
      title: 'Resolved',
      value: '32',
      subtitle: 'This month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const complaints = [
    {
      id: 1,
      title: 'Driver arrived late',
      description: 'The driver was 20 minutes late for pickup without any prior notification. My child had to wait in the cold.',
      reporter: 'Emma Johnson',
      reporterEmail: 'emma.j@email.com',
      reporterRole: 'parent',
      driver: 'John Smith',
      driverEmail: 'john.smith@email.com',
      vanNumber: 'Van #A123',
      severity: 'medium',
      status: 'open',
      category: 'Punctuality',
      submittedDate: '2025-10-09 08:30 AM',
      lastUpdated: '2025-10-09 08:30 AM',
      assignedTo: null,
    },
    {
      id: 2,
      title: 'Rude behavior reported',
      description: 'The driver was very rude and unprofessional when I asked about the route timing. This is unacceptable behavior.',
      reporter: 'Michael Davis',
      reporterEmail: 'michael.d@email.com',
      reporterRole: 'parent',
      driver: 'Robert Lee',
      driverEmail: 'robert.l@email.com',
      vanNumber: 'Van #D012',
      severity: 'high',
      status: 'investigating',
      category: 'Behavior',
      submittedDate: '2025-10-08 02:15 PM',
      lastUpdated: '2025-10-09 10:00 AM',
      assignedTo: 'Admin Support',
      notes: 'Contacted driver for statement. Awaiting response.',
    },
    {
      id: 3,
      title: 'Van cleanliness issue',
      description: 'The van interior was dirty with food wrappers and the seats were not clean. This is a hygiene concern.',
      reporter: 'Sarah Miller',
      reporterEmail: 'sarah.m@email.com',
      reporterRole: 'parent',
      driver: 'David Clark',
      driverEmail: 'david.c@email.com',
      vanNumber: 'Van #C789',
      severity: 'low',
      status: 'resolved',
      category: 'Cleanliness',
      submittedDate: '2025-10-07 09:00 AM',
      lastUpdated: '2025-10-08 03:00 PM',
      assignedTo: 'Admin Support',
      resolution: 'Driver has been warned and van has been cleaned. Additional inspections scheduled.',
      resolvedDate: '2025-10-08 03:00 PM',
    },
    {
      id: 4,
      title: 'Unsafe driving',
      description: 'The driver was speeding and making sudden stops. I am very concerned about my child\'s safety.',
      reporter: 'Lisa Anderson',
      reporterEmail: 'lisa.a@email.com',
      reporterRole: 'parent',
      driver: 'Michael Brown',
      driverEmail: 'michael.b@email.com',
      vanNumber: 'Van #B456',
      severity: 'high',
      status: 'investigating',
      category: 'Safety',
      submittedDate: '2025-10-08 04:30 PM',
      lastUpdated: '2025-10-09 11:00 AM',
      assignedTo: 'Admin Support',
      notes: 'Reviewing GPS data and route history. Driver interview scheduled.',
    },
    {
      id: 5,
      title: 'Missed pickup',
      description: 'The driver completely missed our pickup location. We had to arrange alternative transportation.',
      reporter: 'James Wilson',
      reporterEmail: 'james.w@email.com',
      reporterRole: 'parent',
      driver: 'John Smith',
      driverEmail: 'john.smith@email.com',
      vanNumber: 'Van #A123',
      severity: 'high',
      status: 'open',
      category: 'Service',
      submittedDate: '2025-10-09 07:45 AM',
      lastUpdated: '2025-10-09 07:45 AM',
      assignedTo: null,
    },
  ];

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || complaint.severity === filterSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const selectedItem = selectedComplaint ? complaints.find(c => c.id === selectedComplaint) : null;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="danger"><Flag className="w-3 h-3" />High</Badge>;
      case 'medium':
        return <Badge variant="warning"><Flag className="w-3 h-3" />Medium</Badge>;
      case 'low':
        return <Badge variant="secondary"><Flag className="w-3 h-3" />Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="warning"><Clock className="w-3 h-3" />Open</Badge>;
      case 'investigating':
        return <Badge variant="secondary"><Search className="w-3 h-3" />Investigating</Badge>;
      case 'resolved':
        return <Badge variant="success"><CheckCircle className="w-3 h-3" />Resolved</Badge>;
      case 'closed':
        return <Badge variant="secondary"><XCircle className="w-3 h-3" />Closed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar userRole="admin" userName="Admin User" userEmail="admin@vanpooling.com" />

      <div className="flex-1">
        <Header title="Complaint Management" subtitle="Handle and resolve user complaints" />

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

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search complaints..."
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
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none"
                >
                  <option value="all">All Severity</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Complaints List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Complaints</CardTitle>
                  <CardDescription>{filteredComplaints.length} total</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
                    {filteredComplaints.map((complaint) => (
                      <button
                        key={complaint.id}
                        onClick={() => setSelectedComplaint(complaint.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedComplaint === complaint.id
                            ? 'border-primary bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-neutral-900 text-sm line-clamp-1">
                            {complaint.title}
                          </h4>
                          {getSeverityBadge(complaint.severity)}
                        </div>

                        <p className="text-xs text-neutral-600 mb-3 line-clamp-2">
                          {complaint.description}
                        </p>

                        <div className="flex items-center justify-between">
                          {getStatusBadge(complaint.status)}
                          <span className="text-xs text-neutral-500">{complaint.submittedDate.split(' ')[0]}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Complaint Details */}
            <div className="lg:col-span-2">
              {selectedItem ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle>{selectedItem.title}</CardTitle>
                          {getSeverityBadge(selectedItem.severity)}
                          {getStatusBadge(selectedItem.status)}
                        </div>
                        <CardDescription>
                          Complaint ID: #{selectedItem.id} • Category: {selectedItem.category}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Complaint Details */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3">Description</h3>
                      <p className="text-neutral-700 p-4 bg-neutral-50 rounded-lg">
                        {selectedItem.description}
                      </p>
                    </div>

                    {/* Parties Involved */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Reporter
                        </h4>
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar name={selectedItem.reporter} size="md" />
                          <div>
                            <p className="font-semibold text-neutral-900">{selectedItem.reporter}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {selectedItem.reporterRole}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">{selectedItem.reporterEmail}</p>
                      </div>

                      <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
                        <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          Driver
                        </h4>
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar name={selectedItem.driver} size="md" />
                          <div>
                            <p className="font-semibold text-neutral-900">{selectedItem.driver}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {selectedItem.vanNumber}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">{selectedItem.driverEmail}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3">Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-neutral-500" />
                          <span className="text-neutral-600">Submitted:</span>
                          <span className="font-semibold text-neutral-900">{selectedItem.submittedDate}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-4 h-4 text-neutral-500" />
                          <span className="text-neutral-600">Last Updated:</span>
                          <span className="font-semibold text-neutral-900">{selectedItem.lastUpdated}</span>
                        </div>
                        {selectedItem.resolvedDate && (
                          <div className="flex items-center gap-3 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-neutral-600">Resolved:</span>
                            <span className="font-semibold text-neutral-900">{selectedItem.resolvedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedItem.notes && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-3">Investigation Notes</h3>
                        <p className="text-neutral-700 p-4 bg-highlight-50 rounded-lg border border-highlight-200">
                          {selectedItem.notes}
                        </p>
                      </div>
                    )}

                    {/* Resolution */}
                    {selectedItem.resolution && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-3">Resolution</h3>
                        <p className="text-neutral-700 p-4 bg-green-50 rounded-lg border border-green-200">
                          {selectedItem.resolution}
                        </p>
                      </div>
                    )}

                    {/* Add Response */}
                    {selectedItem.status !== 'resolved' && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-3">Add Response</h3>
                        <textarea
                          placeholder="Add notes or response to this complaint..."
                          className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                          rows={4}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {selectedItem.status === 'open' && (
                        <Button variant="primary" className="flex-1">
                          <Search className="w-4 h-4" />
                          Start Investigation
                        </Button>
                      )}
                      {selectedItem.status === 'investigating' && (
                        <Button variant="primary" className="flex-1">
                          <CheckCircle className="w-4 h-4" />
                          Mark as Resolved
                        </Button>
                      )}
                      <Button variant="outline" className="flex-1">
                        <MessageSquare className="w-4 h-4" />
                        Contact Reporter
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageSquare className="w-4 h-4" />
                        Contact Driver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertTriangle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Select a complaint
                    </h3>
                    <p className="text-neutral-600">
                      Choose a complaint from the list to view details and take action
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
