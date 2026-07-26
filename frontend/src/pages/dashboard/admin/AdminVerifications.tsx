import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  AlertTriangle,
  Car,
  User,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminVerifications() {
  const [selectedVerification, setSelectedVerification] = useState<number | null>(null);

  const stats = [
    {
      title: 'Pending',
      value: '23',
      subtitle: 'Awaiting review',
      icon: Clock,
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
    {
      title: 'Approved',
      value: '142',
      subtitle: 'This month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Rejected',
      value: '8',
      subtitle: 'This month',
      icon: XCircle,
      color: 'text-accent',
      bgColor: 'bg-accent-50',
    },
    {
      title: 'Avg Time',
      value: '2.5 hrs',
      subtitle: 'Processing time',
      icon: Shield,
      color: 'text-secondary',
      bgColor: 'bg-secondary-50',
    },
  ];

  const verifications = [
    {
      id: 1,
      driverName: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: '+1 (555) 345-6789',
      vanNumber: 'Van #C789',
      submittedDate: '2025-10-09 10:30 AM',
      status: 'pending',
      documents: [
        { type: 'Driver License', status: 'uploaded', url: '#', verified: false },
        { type: 'ID Card', status: 'uploaded', url: '#', verified: false },
        { type: 'Vehicle Registration', status: 'uploaded', url: '#', verified: false },
        { type: 'Insurance Certificate', status: 'uploaded', url: '#', verified: false },
        { type: 'Background Check', status: 'uploaded', url: '#', verified: false },
      ],
      priority: 'high',
    },
    {
      id: 2,
      driverName: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+1 (555) 789-0123',
      vanNumber: 'Van #B456',
      submittedDate: '2025-10-09 09:15 AM',
      status: 'pending',
      documents: [
        { type: 'Driver License', status: 'uploaded', url: '#', verified: false },
        { type: 'ID Card', status: 'uploaded', url: '#', verified: false },
        { type: 'Vehicle Registration', status: 'uploaded', url: '#', verified: false },
        { type: 'Insurance Certificate', status: 'missing', url: null, verified: false },
        { type: 'Background Check', status: 'uploaded', url: '#', verified: false },
      ],
      priority: 'medium',
      notes: 'Insurance certificate missing',
    },
    {
      id: 3,
      driverName: 'James Taylor',
      email: 'james.t@email.com',
      phone: '+1 (555) 890-1234',
      vanNumber: 'Van #F678',
      submittedDate: '2025-10-08 03:45 PM',
      status: 'pending',
      documents: [
        { type: 'Driver License', status: 'uploaded', url: '#', verified: false },
        { type: 'ID Card', status: 'uploaded', url: '#', verified: false },
        { type: 'Vehicle Registration', status: 'uploaded', url: '#', verified: false },
        { type: 'Insurance Certificate', status: 'uploaded', url: '#', verified: false },
        { type: 'Background Check', status: 'pending', url: null, verified: false },
      ],
      priority: 'low',
      notes: 'Background check in progress',
    },
  ];

  const selectedItem = selectedVerification ? verifications.find(v => v.id === selectedVerification) : null;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar userRole="admin" userName="Admin User" userEmail="admin@vanpooling.com" />

      <div className="flex-1">
        <Header title="Driver Verifications" subtitle="Review and approve driver applications" />

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

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Verification Queue */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Queue</CardTitle>
                  <CardDescription>{verifications.length} pending reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {verifications.map((verification) => (
                      <button
                        key={verification.id}
                        onClick={() => setSelectedVerification(verification.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedVerification === verification.id
                            ? 'border-primary bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar name={verification.driverName} size="md" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-neutral-900 truncate">
                              {verification.driverName}
                            </h4>
                            <p className="text-xs text-neutral-600 truncate">{verification.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {verification.vanNumber}
                          </Badge>
                          <Badge
                            variant={
                              verification.priority === 'high'
                                ? 'danger'
                                : verification.priority === 'medium'
                                ? 'warning'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {verification.priority}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Clock className="w-3 h-3" />
                          <span>{verification.submittedDate}</span>
                        </div>

                        {verification.notes && (
                          <div className="mt-2 p-2 bg-highlight-50 rounded text-xs text-neutral-700">
                            {verification.notes}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Verification Details */}
            <div className="lg:col-span-2">
              {selectedItem ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Verification Details</CardTitle>
                        <CardDescription>Review driver documents and information</CardDescription>
                      </div>
                      <Badge variant="warning">
                        <Clock className="w-3 h-3" />
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Driver Information */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Driver Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                          <User className="w-5 h-5 text-neutral-500" />
                          <div>
                            <p className="text-xs text-neutral-600">Full Name</p>
                            <p className="text-sm font-semibold text-neutral-900">{selectedItem.driverName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                          <Car className="w-5 h-5 text-neutral-500" />
                          <div>
                            <p className="text-xs text-neutral-600">Van Number</p>
                            <p className="text-sm font-semibold text-neutral-900">{selectedItem.vanNumber}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                          <FileText className="w-5 h-5 text-neutral-500" />
                          <div>
                            <p className="text-xs text-neutral-600">Email</p>
                            <p className="text-sm font-semibold text-neutral-900">{selectedItem.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-neutral-500" />
                          <div>
                            <p className="text-xs text-neutral-600">Submitted</p>
                            <p className="text-sm font-semibold text-neutral-900">{selectedItem.submittedDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Submitted Documents</h3>
                      <div className="space-y-3">
                        {selectedItem.documents.map((doc, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-2 ${
                              doc.status === 'missing'
                                ? 'border-accent bg-accent-50'
                                : doc.status === 'pending'
                                ? 'border-highlight bg-highlight-50'
                                : 'border-neutral-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  doc.status === 'uploaded' ? 'bg-secondary-100' : 'bg-neutral-100'
                                }`}>
                                  <FileText className={`w-5 h-5 ${
                                    doc.status === 'uploaded' ? 'text-secondary' : 'text-neutral-400'
                                  }`} />
                                </div>
                                <div>
                                  <p className="font-semibold text-neutral-900">{doc.type}</p>
                                  <p className="text-xs text-neutral-600">
                                    {doc.status === 'uploaded' && 'Uploaded - Ready for review'}
                                    {doc.status === 'missing' && 'Missing - Required document'}
                                    {doc.status === 'pending' && 'Pending - In progress'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {doc.status === 'uploaded' && (
                                  <>
                                    <Button variant="outline" size="sm">
                                      <Eye className="w-4 h-4" />
                                      View
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-green-600 hover:bg-green-50">
                                      <CheckCircle className="w-4 h-4" />
                                      Verify
                                    </Button>
                                  </>
                                )}
                                {doc.status === 'missing' && (
                                  <Badge variant="danger">
                                    <XCircle className="w-3 h-3" />
                                    Missing
                                  </Badge>
                                )}
                                {doc.status === 'pending' && (
                                  <Badge variant="warning">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verification Notes */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Verification Notes</h3>
                      <textarea
                        placeholder="Add notes about this verification (optional)..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                        rows={4}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button variant="primary" className="flex-1">
                        <CheckCircle className="w-4 h-4" />
                        Approve Driver
                      </Button>
                      <Button variant="outline" className="flex-1 text-accent hover:bg-accent-50">
                        <XCircle className="w-4 h-4" />
                        Reject Application
                      </Button>
                      <Button variant="outline">
                        <AlertTriangle className="w-4 h-4" />
                        Request More Info
                      </Button>
                    </div>

                    {/* Warning */}
                    <div className="mt-4 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900 mb-1">Verification Checklist</p>
                          <ul className="text-xs text-neutral-700 space-y-1">
                            <li>✓ Verify all documents are clear and readable</li>
                            <li>✓ Check license expiration date</li>
                            <li>✓ Confirm vehicle registration matches van details</li>
                            <li>✓ Review background check results</li>
                            <li>✓ Ensure insurance is valid and up-to-date</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Shield className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Select a verification
                    </h3>
                    <p className="text-neutral-600">
                      Choose a driver from the queue to review their documents
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
