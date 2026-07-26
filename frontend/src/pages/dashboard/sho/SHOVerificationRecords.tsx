import { useState } from "react";
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
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Printer,
  Search,
  Filter,
} from "lucide-react";
import { useContext } from "react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useDriverApplications from "../../../hooks/police/get/useDriverApplications";
// @ts-ignore
import { getFileUrl } from "../../../api/apiConstant";

export default function SHOVerificationRecords() {
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logOut }: any = useContext(userContext);

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useDriverApplications();

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
        status: app.status ? String(app.status).toLowerCase() : "pending",
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

  // Build a flat list of verification records from driver documents
  const verificationRecords = driversToDisplay.flatMap((driver: any) => {
    console.log("driver", driver);
    return (driver.documents || []).map((doc: any, idx: number) => {
      const docPath = doc?.path || "";
      const docName = String(docPath).replace(/.*[\\/]/, "") || "Document";

      return {
        id: `${driver.id}-${idx}`,
        driverId: String(driver.id || ""),
        driverName: driver.driverName || "Unknown",
        documentType: doc.type || "Document",
        documentNumber: docName,
        path: docPath,
        submittedDate:
          new Date(driver.submittedDate).toLocaleDateString() ||
          new Date().toISOString(),
        expiryDate: doc.expiryDate || null,
        status: doc.verified ? "verified" : "pending",
        verificationDate: doc.verified
          ? new Date(driver.approvalDate).toLocaleDateString() || null
          : null,
        verifiedBy: doc.verified
          ? applicationsData?.police?.full_name || ""
          : "",
        remarks: driver.notes || "",
      };
    });
  });

  console.log("jahjkhsaks", verificationRecords);

  const filteredRecords = verificationRecords.filter((record: any) => {
    const matchesType =
      filterType === "all" ||
      record.documentType.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch =
      record.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.documentNumber.includes(searchQuery) ||
      record.driverId.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  const selectedItem = selectedDocument
    ? verificationRecords.find((v:any) => v.id === selectedDocument)
    : null;

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
          title="Verification Records"
          subtitle="Document verification history and audit trail"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-4 sm:p-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Search className="w-4 h-4 inline mr-2" />
                    Search Records
                  </label>
                  <input
                    type="text"
                    placeholder="By driver name, ID, or document #..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Filter className="w-4 h-4 inline mr-2" />
                    Document Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">All Documents</option>
                    <option value="Driver License">Driver License</option>
                    <option value="CNIC">CNIC</option>
                    <option value="Vehicle Registration">
                      Vehicle Registration
                    </option>
                    <option value="Insurance">Insurance</option>
                    <option value="Police Character">
                      Police Character Certificate
                    </option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Records Table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>All Records ({filteredRecords.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {applicationsLoading && (
                    <div className="text-center py-8">
                      <Search className="w-8 h-8 text-neutral-400 mx-auto mb-2 animate-spin" />
                      <p className="text-neutral-600">Loading records...</p>
                    </div>
                  )}
                  {applicationsError && (
                    <div className="text-center py-8">
                      <XCircle className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="text-accent">Failed to load records</p>
                    </div>
                  )}
                  {!applicationsLoading && !applicationsError && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-200">
                            <th className="text-left px-3 py-2 font-semibold text-neutral-700">
                              Driver
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-neutral-700">
                              Document
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-neutral-700">
                              Submitted
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-neutral-700">
                              Status
                            </th>
                            <th className="text-left px-3 py-2 font-semibold text-neutral-700">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecords.map((record:any) => (
                            <tr
                              key={record.id}
                              className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                            >
                              <td className="px-3 py-3">
                                <div>
                                  <p className="font-medium text-neutral-900 text-xs sm:text-sm">
                                    {record.driverName}
                                  </p>
                                  <p className="text-xs text-neutral-500">
                                    {record.driverId}
                                  </p>
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <div className="text-xs sm:text-sm text-neutral-900">
                                  {record.documentType}
                                </div>
                                <p className="text-xs text-neutral-500">
                                  {record.documentNumber}
                                </p>
                              </td>
                              <td className="px-3 py-3 text-xs sm:text-sm text-neutral-600 whitespace-nowrap">
                                {new Date(
                                  record.submittedDate,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-3 py-3">
                                <Badge
                                  variant={
                                    record.status === "verified"
                                      ? "success"
                                      : record.status === "rejected"
                                        ? "danger"
                                        : "warning"
                                  }
                                  className="text-xs"
                                >
                                  {record.status}
                                </Badge>
                              </td>
                              <td className="px-3 py-3">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="text-xs h-7"
                                  onClick={() => setSelectedDocument(record.id)}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredRecords.length === 0 && (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                          <p className="text-neutral-600 text-sm">
                            No records found
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
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base">
                      {selectedItem.documentType}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {selectedItem.driverName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {/* Document Info */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Document Details
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50 p-3 rounded">
                        <div className="flex justify-between">
                          <span>Document #:</span>
                          <span className="font-medium text-neutral-900">
                            {selectedItem.documentNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expiry Date:</span>
                          <span className="font-medium text-neutral-900">
                            {new Date(
                              selectedItem.expiryDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Submission Info */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Submission
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600">
                        <div>
                          <span className="text-neutral-700">Date:</span>
                          <p className="font-medium text-neutral-900">
                            {selectedItem.submittedDate}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Verification Info */}
                    {selectedItem.status !== "pending" && (
                      <div className="border-t pt-4">
                        <p className="text-xs font-semibold text-neutral-700 mb-2">
                          Verification
                        </p>
                        <div className="space-y-2 text-xs text-neutral-600">
                          <div>
                            <span className="text-neutral-700">Date:</span>
                            <p className="font-medium text-neutral-900">
                              {selectedItem.verificationDate}
                            </p>
                          </div>
                          <div>
                            <span className="text-neutral-700">
                              Verified By:
                            </span>
                            <p className="font-medium text-neutral-900">
                              {selectedItem.verifiedBy}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Badge
                              variant={
                                selectedItem.status === "verified"
                                  ? "success"
                                  : "danger"
                              }
                              className="text-xs"
                            >
                              {selectedItem.status === "verified" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {selectedItem.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Remarks */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Remarks
                      </p>
                      <p className="text-xs text-neutral-600 bg-neutral-50 p-2 rounded">
                        {selectedItem.remarks}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="border-t pt-4 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 text-xs h-8"
                        variant="secondary"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 text-xs h-8"
                        variant="secondary"
                      >
                        <Printer className="w-3 h-3 mr-1" />
                        Print
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-600 text-sm">
                      Select a record to view details
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
