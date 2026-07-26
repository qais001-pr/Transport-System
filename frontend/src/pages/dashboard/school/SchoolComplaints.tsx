import { useMemo, useState } from "react";
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
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Reply,
  XCircle,
} from "lucide-react";
import { useContext } from "react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useSchoolComplaints from "../../../hooks/schools/get/useSchoolComplaints";
//@ts-ignore
import useUpdateComplaintStatus from "../../../hooks/schools/put/useUpdateComplaintStatus";

export default function SchoolComplaints() {
  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(
    null,
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "open" | "resolved" | "in-progress" | "rejected"
  >("all");
  // const [filterPriority, setFilterPriority] = useState<
  //   "all" | "high" | "medium" | "low"
  // >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logOut }: any = useContext(userContext);
  const { data: complaintsData, isLoading, error } = useSchoolComplaints();

  const { mutate: updateComplaintStatus, isPending } =
    useUpdateComplaintStatus();

  const handleStatusChange = (status: string) => {
    if (!selectedItem) return;

    updateComplaintStatus({
      complaintId: selectedItem.id,
      status,
    });
  };

  const complaints = useMemo(() => {
    if (!complaintsData) return [];
    return (
      complaintsData?.map((c: any) => ({
        id: Number(c.id),
        complaintId: `C-${c.id}`,
        driverId: Number(c.driver_id),
        driverName: c?.driver_name || "Unknown",
        category: "Driver Complaint",
        subject: c?.description?.slice(0, 40) + "...",
        description: c?.description || "",
        priority: "medium",
        status:
          c?.status === "OPEN"
            ? "open"
            : c?.status === "RESOLVED"
              ? "resolved"
              : c?.status === "REJECTED"
                ? "rejected"
                : "in-progress",
        submittedDate: new Date(c.created_at).toLocaleDateString(),
        submittedBy: c?.full_name || "Unknown",
        phone: c?.phone || "N/A",
        studentName: c?.child_name || "N/A",
        responses: [],
      })) || []
    );
  }, [complaintsData]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint: any) => {
      const matchesStatus =
        filterStatus === "all" || complaint.status === filterStatus;

      const matchesSearch =
        (complaint.driverName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (complaint.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (complaint.complaintId || "").includes(searchQuery);

      return matchesStatus && matchesSearch;
    });
  }, [complaints, filterStatus, searchQuery]);

  const selectedItem = selectedComplaint
    ? complaints.find((c: any) => c.id === selectedComplaint)
    : null;

  const stats = [
    {
      title: "Open Complaints",
      value: complaints
        .filter((c: any) => c.status === "open")
        .length.toString(),
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
    {
      title: "Resolved",
      value: complaints
        .filter((c: any) => c.status === "resolved")
        .length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "In Progress",
      value: complaints
        .filter((c: any) => c.status === "in-progress")
        .length.toString(),
      icon: Clock,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
    },
    {
      title: "Rejected",
      value: complaints
        .filter((c: any) => c.status === "rejected")
        .length.toString(),
      icon: XCircle,
      color: "text-danger",
      bgColor: "bg-danger-50",
    },
    {
      title: "Total Complaints",
      value: complaints.length.toString(),
      icon: MessageSquare,
      color: "text-primary",
      bgColor: "bg-primary-50",
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
          title="Complaint Management"
          subtitle="Manage and track complaints about drivers"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-4 sm:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 mb-6 sm:mb-8">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by driver, ID, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as any)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div> */}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Complaints List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Complaints ({filteredComplaints.length})
                  </CardTitle>
                  <CardDescription>
                    Click a complaint to view and respond
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading && (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2 animate-spin" />
                      <p className="text-neutral-600">Loading complaints...</p>
                    </div>
                  )}
                  {error && (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="text-accent">
                        {error ||
                          "Failed to load complaints. Please try again."}
                      </p>
                    </div>
                  )}
                  <div className="space-y-3 max-h-96 sm:max-h-none overflow-y-auto">
                    {filteredComplaints.length > 0 ? (
                      filteredComplaints.map((complaint: any) => (
                        <div
                          key={complaint.id}
                          onClick={() => setSelectedComplaint(complaint.id)}
                          className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            selectedComplaint === complaint.id
                              ? "border-primary bg-primary-50"
                              : "border-neutral-200 bg-white hover:border-primary"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-semibold text-neutral-900 text-sm">
                                  {complaint.subject}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  {complaint.complaintId}
                                </Badge>
                              </div>
                              <p className="text-xs text-neutral-600 mb-2 truncate">
                                <strong>Driver:</strong> {complaint.driverName}
                              </p>
                              <p className="text-xs text-neutral-600">
                                Parent: {complaint.submittedBy || "N/A"}
                              </p>
                              <p className="text-xs text-neutral-600">
                                Phone: {complaint.phone || "N/A"}
                              </p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {/* <Badge
                                  variant={
                                    complaint.priority === "high"
                                      ? "danger"
                                      : complaint.priority === "medium"
                                        ? "warning"
                                        : "secondary"
                                  }
                                >
                                  {complaint.priority}
                                </Badge> */}
                                <Badge
                                  variant={
                                    complaint.status === "resolved"
                                      ? "success"
                                      : complaint.status === "open"
                                        ? "danger"
                                        : complaint.status === "rejected"
                                          ? "secondary"
                                          : "warning"
                                  }
                                >
                                  {complaint.status}
                                </Badge>
                                <span className="text-neutral-500">
                                  {complaint.category}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-neutral-500">
                                {complaint.responses.length} responses
                              </span>
                              <Reply className="w-4 h-4 text-neutral-400" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : !isLoading && !error ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                        <p className="text-neutral-600">No complaints found</p>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              {selectedItem ? (
                <Card className="sticky top-6 h-fit max-h-96 sm:max-h-none overflow-y-auto">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">
                          {selectedItem.subject}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {selectedItem.complaintId}
                        </CardDescription>
                      </div>
                      {/* <Badge
                        variant={
                          selectedItem.status === "open"
                            ? "danger"
                            : selectedItem.open === "in-progress"
                              ? "warning"
                              : "secondary"
                        }
                        className="text-xs flex-shrink-0 capitalize"
                      >
                        {selectedItem.status}
                      </Badge> */}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {/* Status */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Status
                      </p>
                      <Badge
                        variant={
                          selectedItem.status === "resolved"
                            ? "success"
                            : selectedItem.status === "open"
                              ? "danger"
                              : selectedItem.status === "rejected"
                                ? "secondary"
                                : "warning"
                        }
                        className="w-full justify-center"
                      >
                        {selectedItem.status}
                      </Badge>
                    </div>

                    {/* Driver Info */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Driver
                      </p>
                      <p className="text-sm font-medium text-neutral-900">
                        {selectedItem.driverName}
                      </p>
                      <p className="text-xs text-neutral-600 mt-1">
                        Category: {selectedItem.category}
                      </p>
                    </div>

                    {/* Student & Date */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Details
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50 p-2 rounded">
                        <div>
                          <span className="font-medium">Student:</span>{" "}
                          {selectedItem.studentName}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span>{" "}
                          {selectedItem.submittedDate}
                        </div>
                        <div>
                          <span className="font-medium">By:</span>{" "}
                          {selectedItem?.submittedBy}
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

                    {/* Response Count */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Responses ({selectedItem.responses.length})
                      </p>
                      <div className="text-xs text-neutral-600">
                        {selectedItem.responses.length === 0 ? (
                          <p className="italic">No responses yet</p>
                        ) : (
                          <p>
                            {selectedItem.responses.length} response(s) received
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {selectedItem.status !== "resolved" &&
                      selectedItem.status !== "rejected" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={isPending}
                            onClick={() => handleStatusChange("RESOLVED")}
                          >
                            Mark as Resolved
                          </Button>

                          {selectedItem.status !== "in-progress" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              disabled={isPending}
                              onClick={() => handleStatusChange("IN_PROGRESS")}
                            >
                              Mark as In Progress
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={isPending}
                            onClick={() => handleStatusChange("REJECTED")}
                          >
                            Mark as Rejected
                          </Button>
                        </>
                      )}

                    {/* <div className="border-t pt-4 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 text-xs h-8"
                        variant="secondary"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Resolved
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 text-xs h-8"
                        variant="primary"
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        In Progress
                      </Button>
                    </div> */}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-600 text-sm">
                      Select a complaint to view details
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
