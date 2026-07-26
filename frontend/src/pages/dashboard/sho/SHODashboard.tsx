import { useState, useContext } from "react";
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
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Phone,
  Download,
  XCircle,
  Users,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useDriverApplications from "../../../hooks/police/get/useDriverApplications";
// @ts-ignore
import useVerifyDriver from "../../../hooks/police/put/useVerifyDriver"; // mutation for approving/rejecting drivers
// @ts-ignore
import { getFileUrl } from "../../../api/apiConstant";

export default function SHODashboard() {
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logOut }: any = useContext(userContext);

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useDriverApplications();

  const verifyDriver = useVerifyDriver();
  // track which action is currently being processed so we can show separate loading states
  const [processingAction, setProcessingAction] = useState<
    "approve" | "reject" | null
  >(null);

  const handleApprove = () => {
    if (!selectedItem) return;
    setProcessingAction("approve");
    verifyDriver.mutate(
      { driver_id: selectedItem.id, is_approved: true },
      {
        onSettled: () => {
          setProcessingAction(null);
        },
      },
    );
  };

  const handleReject = () => {
    if (!selectedItem) return;
    setProcessingAction("reject");
    verifyDriver.mutate(
      { driver_id: selectedItem.id, is_approved: false },
      {
        onSettled: () => {
          setProcessingAction(null);
        },
      },
    );
  };

  const driverVerifications = Array.isArray(applicationsData?.drivers)
    ? applicationsData?.drivers.map((app: any, idx: number) => ({
        id: app.id || idx + 1,
        driverName: app.full_name || app.driver_name || "Unknown",
        fatherName: app.father_name || "Unknown",
        cnic: app.cnic || "N/A",
        email: app.email || "N/A",
        phone: app.phone || "N/A",
        age: app.age || 0,
        address: app.address || "N/A",
        vans: Array.isArray(app.vans) ? app.vans.filter(Boolean) : [],
        licenseNumber: app.license_number || "N/A",
        licenseExpiry: app.license_expiry || "2026-12-31",
        submittedDate:
          app.created_at ||
          app.submitted_date ||
          new Date().toLocaleDateString(),
        status: app.status.toLowerCase() || "pending",
        priority: app.priority || "medium",
        documents: Array.isArray(app.driver_documents)
          ? app.driver_documents?.flatMap((doc: any) => [
              {
                type: "Driver License",
                path: getFileUrl(doc.driver_license),
                verified: doc.is_verified ?? false,
              },
              {
                type: "CNIC (National ID)",
                path: getFileUrl(doc.id_card),
                verified: doc.is_verified ?? false,
              },
              {
                type: "Vehicle Registration",
                path: getFileUrl(doc.number_plate),
                verified: doc.is_verified ?? false,
              },
              {
                type: "Vehicle Documents",
                path: getFileUrl(doc.vehicle_docs),
                verified: doc.is_verified ?? false,
              },
              {
                type: "Vehicle Photo",
                path: getFileUrl(doc.vehicle_photo),
                verified: doc.is_verified ?? false,
              },
            ])
          : [],
        notes: app.notes || "",
        previousViolations: app.previous_violations || 0,
        approvalDate: app.approval_date,
      }))
    : [];

  const driversToDisplay =
    driverVerifications && driverVerifications.length > 0
      ? driverVerifications
      : [];

  const filteredDrivers = driversToDisplay.filter((driver:any) => {
    const matchesStatus =
      filterStatus === "all" || driver.status === filterStatus;
    const matchesSearch =
      driver.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.cnic.includes(searchQuery) ||
      driver.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const selectedItem = selectedDriver
    ? driversToDisplay.find((v:any) => v.id === selectedDriver)
    : null;

  const stats = [
    {
      title: "Pending Verifications",
      value: driversToDisplay
        .filter((d:any) => d.status === "pending")
        .length.toString(),
      subtitle: "Awaiting review",
      icon: Clock,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
    },
    {
      title: "Approved Drivers",
      value: driversToDisplay
        .filter((d:any) => d.status === "approved")
        .length.toString(),
      subtitle: "Verified & active",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Rejected Applications",
      value: driversToDisplay
        .filter((d:any) => d.status === "rejected")
        .length.toString(),
      subtitle: "This month",
      icon: XCircle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
    {
      title: "Total Drivers",
      value: driversToDisplay.length.toString(),
      subtitle: "Under review",
      icon: Users,
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
          title="Driver Verification Dashboard"
          subtitle="Police Station House Officer - Review and verify van drivers"
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
                  <p className="text-xs text-neutral-500">{stat.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter and Search Section */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Search Driver
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, CNIC, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Verification List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Driver Applications ({filteredDrivers.length})
                  </CardTitle>
                  <CardDescription>
                    Click a driver to view detailed verification information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applicationsLoading && (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2 animate-spin" />
                      <p className="text-neutral-600">
                        Loading applications...
                      </p>
                    </div>
                  )}
                  {applicationsError && (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="text-accent">Failed to load applications</p>
                    </div>
                  )}
                  {!applicationsLoading && !applicationsError && (
                    <div className="space-y-3 max-h-96 sm:max-h-none overflow-y-auto">
                      {filteredDrivers.length > 0 ? (
                        filteredDrivers.map((verification: any) => (
                          <div
                            key={verification.id}
                            onClick={() => setSelectedDriver(verification.id)}
                            className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              selectedDriver === verification.id
                                ? "border-primary bg-primary-50"
                                : "border-neutral-200 bg-white hover:border-primary"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <Avatar
                                  name={verification.driverName}
                                  size="md"
                                  className="flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap gap-2 items-start">
                                    <h4 className="font-semibold text-neutral-900 text-sm">
                                      {verification.driverName}
                                    </h4>
                                    {verification.priority === "high" && (
                                      <Badge
                                        variant="warning"
                                        className="text-xs flex-shrink-0"
                                      >
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        High Priority
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-neutral-600 mt-1 truncate">
                                    {verification.email || verification.cnic}
                                  </p>
                                  <p className="text-xs text-neutral-500 truncate">
                                    {(verification as any).vans &&
                                    (verification as any).vans.length > 0
                                      ? (verification as any).vans.join(", ")
                                      : (verification as any).vanNumber ||
                                        "No vans"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge
                                  variant={
                                    verification.status === "approved"
                                      ? "success"
                                      : verification.status === "rejected"
                                        ? "danger"
                                        : "warning"
                                  }
                                  className="text-xs"
                                >
                                  {verification.status === "approved" ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : verification.status === "rejected" ? (
                                    <XCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <Clock className="w-3 h-3 mr-1" />
                                  )}
                                  {verification.status.charAt(0).toUpperCase() +
                                    verification.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                          <p className="text-neutral-600">
                            No drivers found matching your criteria
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detail View */}
            <div className="lg:col-span-1">
              {selectedItem ? (
                <Card className="sticky top-6 h-fit max-h-96 sm:max-h-none overflow-y-auto">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">
                          {selectedItem.driverName}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Van No:{" "}
                          {(selectedItem as any)?.vans &&
                          (selectedItem as any).vans.length > 0
                            ? (selectedItem as any).vans.join(", ")
                            : (selectedItem as any).vanNumber ||
                              "No van assigned"}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          selectedItem.status === "approved"
                            ? "success"
                            : selectedItem.status === "rejected"
                              ? "danger"
                              : "warning"
                        }
                        className="text-xs whitespace-nowrap flex-shrink-0"
                      >
                        {selectedItem.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Contact Information
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{selectedItem.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{selectedItem.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* License Info */}
                    {/* <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        License Details
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600">
                        <div className="flex justify-between">
                          <span>License #:</span>
                          <span className="font-medium">
                            {selectedItem.licenseNumber}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Expires:</span>
                          <span
                            className={
                              selectedItem.licenseExpiry < "2026-02-24"
                                ? "text-accent font-medium"
                                : "font-medium"
                            }
                          >
                            {new Date(
                              selectedItem.licenseExpiry,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div> */}

                    {/* Documents Status */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Documents
                      </p>
                      <div className="space-y-2">
                        {selectedItem?.documents &&
                          selectedItem?.documents?.map(
                            (doc: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs"
                              >
                                <div className="truncate">
                                  <span className="text-neutral-600">
                                    {doc.type}
                                  </span>
                                  {doc.path && (
                                    <a
                                      href={doc.path}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="ml-2 text-xs text-primary underline"
                                    >
                                      View
                                    </a>
                                  )}
                                </div>
                                {doc.verified ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-highlight" />
                                )}
                              </div>
                            ),
                          )}
                      </div>
                    </div>

                    {/* Violations */}
                    {selectedItem.previousViolations > 0 && (
                      <div className="border-t pt-4 bg-accent-50 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-accent mb-1">
                          ⚠️ Previous Violations:{" "}
                          {selectedItem.previousViolations}
                        </p>
                        <p className="text-xs text-accent-700">
                          Review history before approval
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="border-t pt-4 flex gap-2">
                      {selectedItem.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="flex-1 text-xs h-8"
                            variant="primary"
                            onClick={handleApprove}
                            disabled={processingAction !== null}
                          >
                            {processingAction === "approve" ? (
                              <>
                                <Clock className="w-3 h-3 mr-1 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 text-xs h-8"
                            variant="accent"
                            onClick={handleReject}
                            disabled={processingAction !== null}
                          >
                            {processingAction === "reject" ? (
                              <>
                                <Clock className="w-3 h-3 mr-1 animate-spin" />
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </>
                            )}
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        className="flex-1 text-xs h-8"
                        variant="secondary"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-600 text-sm">
                      Select a driver to view details
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

// documents: (function () {
//           const docs: any[] = [];
//           const source = app.driver_documents;
//           if (Array.isArray(source) && source.length > 0) {
//             // API may return array of objects
//             source.forEach((d: any) => {
//               if (d.driver_license) docs.push({ type: "Driver License", path: getFileUrl(d.driver_license), verified: d.is_verified ?? false });
//               if (d.id_card) docs.push({ type: "ID Card", path: getFileUrl(d.id_card), verified: d.is_verified ?? false });
//               if (d.vehicle_docs) docs.push({ type: "Vehicle Docs", path: getFileUrl(d.vehicle_docs), verified: d.is_verified ?? false });
//               if (d.vehicle_photo) docs.push({ type: "Vehicle Photo", path: getFileUrl(d.vehicle_photo), verified: d.is_verified ?? false });
//               if (d.number_plate) docs.push({ type: "Number Plate", path: getFileUrl(d.number_plate), verified: d.is_verified ?? false });
//             });
//           } else if (source && typeof source === "object") {
//             if (source.driver_license) docs.push({ type: "Driver License", path: getFileUrl(source.driver_license), verified: source.is_verified ?? false });
//             if (source.id_card) docs.push({ type: "ID Card", path: getFileUrl(source.id_card), verified: source.is_verified ?? false });
//             if (source.vehicle_docs) docs.push({ type: "Vehicle Docs", path: getFileUrl(source.vehicle_docs), verified: source.is_verified ?? false });
//             if (source.vehicle_photo) docs.push({ type: "Vehicle Photo", path: getFileUrl(source.vehicle_photo), verified: source.is_verified ?? false });
//             if (source.number_plate) docs.push({ type: "Number Plate", path: getFileUrl(source.number_plate), verified: source.is_verified ?? false });
//           }
//           return docs;
//         })(),
