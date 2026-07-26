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
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Flag,
  Eye,
  Download,
  X,
} from "lucide-react";
import { useContext } from "react";
import userContext from "../../../context/userContext";

export default function SHOViolations() {
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user,logOut } = useContext(userContext);

  const violations = [
    {
      id: 1,
      driverId: "DRV-004",
      driverName: "Usman Rauf",
      phone: "+92 345 1234567",
      cnic: "23456-7890123-4",
      address: "321 Pine Lane, Rawalpindi",
      violationType: "License Violation",
      severity: "critical",
      date: "2026-02-15",
      description:
        "Expired driver license (DL-2025-004). License expired on 2025-12-05.",
      status: "pending",
      recordedBy: "SHO Muhammad Shahid",
      action: "Application rejected - license must be renewed",
    },
    {
      id: 2,
      driverId: "DRV-002",
      driverName: "Muhammad Ali Syed",
      phone: "+92 321 9876543",
      cnic: "45678-9012345-6",
      address: "456 Oak Road, Karachi",
      violationType: "Missing Documentation",
      severity: "high",
      date: "2026-02-19",
      description:
        "Insurance certificate missing from application. Required for verification.",
      status: "pending",
      recordedBy: "ASI Ayesha Khan",
      action: "Awaiting resubmission of insurance certificate",
    },
    {
      id: 3,
      driverId: "DRV-005",
      driverName: "Sara Hassan",
      phone: "+92 333 5678901",
      cnic: "98765-4321098-7",
      address: "789 Cedar Road, Multan",
      violationType: "Document Fraud Attempt",
      severity: "critical",
      date: "2026-02-10",
      description:
        "Suspicious document: Vehicle registration appears to be forged. Document rejected.",
      status: "resolved",
      recordedBy: "SHO Muhammad Shahid",
      action: "Case registered - application permanently rejected",
    },
    {
      id: 4,
      driverId: "DRV-006",
      driverName: "Hassan Ahmed",
      phone: "+92 300 1234567",
      cnic: "34567-8901234-5",
      address: "101 Maple Street, Faisalabad",
      violationType: "Criminal Record",
      severity: "critical",
      date: "2026-02-08",
      description:
        "Police character certificate check revealed previous criminal case (robbery - 2023). Ineligible for verification.",
      status: "resolved",
      recordedBy: "SHO Muhammad Shahid",
      action: "Application rejected - criminal record disqualifies applicant",
    },
    {
      id: 5,
      driverId: "DRV-001",
      driverName: "Ahmad Hassan Khan",
      phone: "+92 300 1234567",
      cnic: "12345-6789012-3",
      address: "123 Main Street, Lahore",
      violationType: "Traffic Violation History",
      severity: "medium",
      date: "2026-02-20",
      description:
        "Background check shows 2 traffic violations in past 2 years. Minor issues - approved with caution.",
      status: "resolved",
      recordedBy: "ASI Ayesha Khan",
      action: "Approved with noted violations - monitor performance",
    },
  ];

  const filteredViolations = violations.filter((violation) => {
    const matchesSeverity =
      filterSeverity === "all" || violation.severity === filterSeverity;
    const matchesSearch =
      violation.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.cnic.includes(searchQuery) ||
      violation.driverId.includes(searchQuery);
    return matchesSeverity && matchesSearch;
  });

  const selectedItem = selectedDriver
    ? violations.find((v) => v.id === selectedDriver)
    : null;

  const stats = [
    {
      title: "Critical Violations",
      value: violations
        .filter((v) => v.severity === "critical")
        .length.toString(),
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
    {
      title: "High Priority",
      value: violations.filter((v) => v.severity === "high").length.toString(),
      icon: Flag,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
    },
    {
      title: "Pending Review",
      value: violations.filter((v) => v.status === "pending").length.toString(),
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
    {
      title: "Total Violations",
      value: violations.length.toString(),
      icon: Shield,
      color: "text-secondary",
      bgColor: "bg-secondary-50",
    },
  ];

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
          title="Violations & Issues"
          subtitle="Track driver violations and problematic applications"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-4 sm:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <Card key={index} hover>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div
                      className={`w-10 sm:w-12 h-10 sm:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <stat.icon
                        className={`w-5 sm:w-6 h-5 sm:h-6 ${stat.color}`}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600">
                    {stat.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter Section */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Search Driver
                  </label>
                  <input
                    type="text"
                    placeholder="By name, CNIC, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Filter by Severity
                  </label>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">All Violations</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Violations List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Violations List ({filteredViolations.length})
                  </CardTitle>
                  <CardDescription>
                    Click a violation to view details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 sm:max-h-none overflow-y-auto">
                    {filteredViolations.length > 0 ? (
                      filteredViolations.map((violation) => (
                        <div
                          key={violation.id}
                          onClick={() => setSelectedDriver(violation.id)}
                          className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            selectedDriver === violation.id
                              ? "border-primary bg-primary-50"
                              : "border-neutral-200 bg-white hover:border-primary"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-start gap-2 mb-2">
                                <div>
                                  <h4 className="font-semibold text-neutral-900 text-sm">
                                    {violation.driverName}
                                  </h4>
                                  <p className="text-xs text-neutral-500">
                                    {violation.cnic}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    violation.severity === "critical"
                                      ? "danger"
                                      : violation.severity === "high"
                                        ? "warning"
                                        : "secondary"
                                  }
                                  className="text-xs flex-shrink-0 mt-1"
                                >
                                  {violation.severity}
                                </Badge>
                              </div>
                              <p className="text-xs text-neutral-600 bg-neutral-50 p-2 rounded">
                                {violation.violationType}
                              </p>
                            </div>
                            <Badge
                              variant={
                                violation.status === "resolved"
                                  ? "success"
                                  : violation.status === "pending"
                                    ? "warning"
                                    : "secondary"
                              }
                              className="text-xs flex-shrink-0"
                            >
                              {violation.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                        <p className="text-neutral-600">No violations found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detail View */}
            <div className="lg:col-span-1">
              {selectedItem ? (
                <Card className="sticky top-6 h-fit max-h-96 sm:max-h-none overflow-y-auto">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">
                          {selectedItem.violationType}
                        </CardTitle>
                        <CardDescription className="text-xs truncate">
                          {selectedItem.driverName}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          selectedItem.severity === "critical"
                            ? "danger"
                            : selectedItem.severity === "high"
                              ? "warning"
                              : "secondary"
                        }
                        className="text-xs flex-shrink-0"
                      >
                        {selectedItem.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {/* Driver Info */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Driver Information
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50 p-3 rounded">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {selectedItem.driverId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{selectedItem.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate text-xs">
                            {selectedItem.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Violation Details */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Violation Details
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600">
                        <div>
                          <span className="text-neutral-700">
                            Date Recorded:
                          </span>
                          <p className="font-medium text-neutral-900">
                            {new Date(selectedItem.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-700">Recorded By:</span>
                          <p className="font-medium text-neutral-900">
                            {selectedItem.recordedBy}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Description
                      </p>
                      <p className="text-xs text-neutral-600 bg-neutral-50 p-2 rounded leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>

                    {/* Action Taken */}
                    <div className="border-t pt-4 bg-secondary-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-secondary-900 mb-2">
                        Action Taken
                      </p>
                      <p className="text-xs text-secondary-700 leading-relaxed">
                        {selectedItem.action}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="border-t pt-4">
                      <Badge
                        variant={
                          selectedItem.status === "resolved"
                            ? "success"
                            : selectedItem.status === "pending"
                              ? "warning"
                              : "secondary"
                        }
                        className="w-full justify-center"
                      >
                        {selectedItem.status === "resolved" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {selectedItem.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t pt-4 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 text-xs h-8"
                        variant="secondary"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-600 text-sm">
                      Select a violation to view details
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
