import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  User,
  Send,
  Phone,
  Mail,
  Calendar,
  FileText,
  Download,
  AlertTriangle,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { useContext } from "react";
import userContext from "../../../context/userContext";

export default function SchoolComplaintDetail() {
  const [replyText, setReplyText] = useState("");
  const { user, logOut }: any = useContext(userContext);

  // Mock detailed complaint data
  const complaint = {
    id: 1,
    complaintId: "C-2026-001",
    driverId: 1,
    driverName: "Ahmad Hassan Khan",
    driverPhone: "+92 300 1234567",
    driverEmail: "ahmad.hassan@email.com",
    category: "Safety Concern",
    subject: "Speeding on school route",
    description:
      "Driver was speeding near school zone, putting students at risk. The van was going at approximately 70 km/h in a 40 km/h zone near the school. This is a serious safety concern for all students in the van.",
    priority: "high",
    status: "open",
    submittedDate: "2026-02-23",
    submittedBy: "Parent - Ali Ahmed",
    studentName: "Ahmed Khan (Class 5)",
    studentAge: "11 years",
    studentPhone: "+92 300 XXXXXX7",
    location: "School Zone - Main Road",
    witnesses: "Other parents mentioned seeing the same behavior",
    attachments: ["Photo1.jpg", "Video.mp4"],
    responses: [
      {
        id: 1,
        date: "2026-02-23",
        time: "14:30",
        message:
          "We are aware of this issue and investigating. We have reviewed the incident with the driver and will take appropriate action to ensure student safety.",
        from: "School Admin (Principal)",
        fromEmail: "principal@school.edu",
      },
    ],
  };

  const handleReply = () => {
    if (replyText.trim()) {
      // Handle reply submission
      setReplyText("");
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "Guest"}
        userName={user?.full_name || "Zaman Ali"}
        userEmail={user?.email || "zaman.ali@example.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header
          title={`Complaint: ${complaint.complaintId}`}
          subtitle="View and manage complaint details"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-4 sm:p-6">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Complaints
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Complaint Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card>
                <CardHeader className="pb-3 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <CardTitle>{complaint.subject}</CardTitle>
                      <CardDescription>{complaint.complaintId}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          complaint.priority === "high" ? "danger" : "warning"
                        }
                        className="text-xs"
                      >
                        {complaint.priority} Priority
                      </Badge>
                      <Badge
                        variant={
                          complaint.status === "open" ? "danger" : "warning"
                        }
                        className="text-xs"
                      >
                        {complaint.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Complaint Details
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{complaint.submittedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span>{complaint.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{complaint.location}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Submitted By
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600">
                        <p className="font-medium text-neutral-900">
                          {complaint.submittedBy}
                        </p>
                        <p>{complaint.studentName}</p>
                        <p className="text-neutral-500">
                          Age: {complaint.studentAge}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Complaint Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-4">
                    {complaint.description}
                  </p>
                  <div>
                    <p className="text-xs font-semibold text-neutral-700 mb-2">
                      Witnesses
                    </p>
                    <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded">
                      {complaint.witnesses}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              {complaint.attachments.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {complaint.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-neutral-600" />
                            <span className="text-sm text-neutral-700">
                              {file}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="text-xs h-7"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Conversation */}
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base">
                    Conversation History
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6 mb-6">
                    {complaint.responses.map((response) => (
                      <div key={response.id} className="flex gap-4">
                        <Avatar
                          name={response.from}
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-semibold text-neutral-900">
                                {response.from}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {response.fromEmail}
                              </p>
                            </div>
                            <span className="text-xs text-neutral-500">
                              {response.date} at {response.time}
                            </span>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-lg">
                            <p className="text-sm text-neutral-700">
                              {response.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <div className="border-t pt-6">
                    <p className="text-sm font-semibold text-neutral-700 mb-3">
                      Add Response
                    </p>
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response here..."
                        rows={4}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          onClick={handleReply}
                          disabled={!replyText.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Response
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Driver Info */}
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base">
                    Driver Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar name={complaint.driverName} size="md" />
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900 text-sm">
                        {complaint.driverName}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{complaint.driverPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{complaint.driverEmail}</span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full mt-4 text-xs h-8"
                  >
                    View Driver Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base">Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Driver
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base">Timeline</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-xs">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-accent rounded-full"></div>
                        <div className="w-0.5 h-8 bg-neutral-200"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">
                          Complaint Submitted
                        </p>
                        <p className="text-neutral-600">2026-02-23 by Parent</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">
                          Response Added
                        </p>
                        <p className="text-neutral-600">
                          2026-02-23 by School Admin
                        </p>
                      </div>
                    </div>
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
