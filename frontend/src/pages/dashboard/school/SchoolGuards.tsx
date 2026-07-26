import { useContext, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Phone,
  Mail,
  Calendar,
  Shield,
  AlertCircle,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useSchoolGuards from "../../../hooks/schools/get/useSchoolGuards";
//@ts-ignore
import useApproveGuard from "../../../hooks/schools/put/useAprroveGuard";
//@ts-ignore
import { getFileUrl } from "../../../api/apiConstant";

export default function SchoolGuards() {
  const { user, logOut }: any = useContext(userContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedGuard, setSelectedGuard] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isLoading, isError } = useSchoolGuards();
  const approveMutation = useApproveGuard();

  const guards = (data || []).map((g: any) => ({
    id: g.id,
    name: g.full_name || "Guard Name",
    email: g.email || "guard@example.com",
    phone: g.phone || "guard-phone",
    status: (g.approval_status || "pending").toLowerCase(),
    joinDate: g.created_at || new Date().toISOString(),
    assignedSchool: g.school_name || "Assigned School",
    profilePhoto: g.profile_photo || "",
  }));

  const filteredGuards = guards.filter((guard: any) => {
    const matchesSearch =
      guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guard.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || guard.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (guardId: number) => {
    setSelectedId(guardId);
    approveMutation.mutate(
      { guardId, status: "APPROVED" },
      {
        onSettled: () => setSelectedId(null),
      },
    );
  };

  const handleReject = (guardId: number) => {
    setSelectedId(guardId);
    approveMutation.mutate(
      { guardId, status: "REJECTED" },
      {
        onSettled: () => setSelectedId(null),
      },
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "school"}
        userName={user?.full_name || "School Admin"}
        userEmail={user?.email || "admin@school.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header
          title="GUARDS MANAGEMENT"
          subtitle={`Welcome back, ${user?.full_name || "School Admin"}! Manage your school guards.`}
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Total Guards
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {guards.length}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {
                        guards.filter((g: any) => g.status === "approved")
                          .length
                      }
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {guards.filter((g: any) => g.status === "pending").length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {
                        guards.filter((g: any) => g.status === "rejected")
                          .length
                      }
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      placeholder="Search guards by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "primary" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    className="whitespace-nowrap"
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "primary" : "outline"}
                    onClick={() => setStatusFilter("pending")}
                    className="whitespace-nowrap"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={
                      statusFilter === "approved" ? "primary" : "outline"
                    }
                    onClick={() => setStatusFilter("approved")}
                    className="whitespace-nowrap"
                  >
                    Approved
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guards List */}
          <div className="grid gap-6">
            {isLoading && <div>Loading...</div>}
            {isError && (
              <div className="text-red-500">Failed to load guards</div>
            )}
            {filteredGuards.map((guard: any) => (
              <Card
                key={guard.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Guard Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {guard.profilePhoto ? (
                        <Avatar
                          name={guard.name}
                          src={getFileUrl(guard.profilePhoto)}
                          size="xl"
                        />
                      ) : (
                        <Avatar name={guard.name} size="xl" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900 truncate">
                            {guard.name}
                          </h3>
                          {getStatusBadge(guard.status)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{guard.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{guard.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Joined:{" "}
                              {new Date(guard.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4" />
                            <span>{guard.experience} experience</span>
                          </div> */}
                        </div>

                        <p className="text-sm text-neutral-700">
                          <strong>School:</strong> {guard.assignedSchool}
                        </p>

                        {/* <div className="mt-3">
                          <p className="text-sm font-medium text-neutral-700 mb-2">
                            Documents:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {guard.documents.map((doc, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div> */}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-auto">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => setSelectedGuard(guard)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>

                      {guard.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            disabled={selectedId === guard.id}
                            onClick={() => handleApprove(guard.id)}
                            className="flex-1 sm:flex-none"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {selectedId === guard.id
                              ? "Approving..."
                              : "Approve"}
                          </Button>
                          <Button
                            variant="outline"
                            disabled={selectedId === guard.id}
                            onClick={() => handleReject(guard.id)}
                            className="flex-1 sm:flex-none"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            {selectedId === guard.id
                              ? "Rejecting..."
                              : "Reject"}
                          </Button>
                        </div>
                      )}

                      {guard.status === "approved" && (
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto text-green-600 border-green-200"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Active Guard
                        </Button>
                      )}

                      {guard.status === "rejected" && (
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto text-red-600 border-red-200"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejected
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGuards.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Shield className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  No guards found
                </h3>
                <p className="text-neutral-600">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No school guards have applied yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Guard Details Modal */}
      {selectedGuard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {/* Modal Box */}
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative animate-fadeIn">
            {/* Close */}
            <button
              onClick={() => setSelectedGuard(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              {selectedGuard.profilePhoto ? (
                <Avatar
                  name={selectedGuard.name}
                  src={getFileUrl(selectedGuard.profilePhoto)}
                  size="xl"
                />
              ) : (
                <Avatar name={selectedGuard.name} size="xl" />
              )}
              <div>
                <h2 className="text-xl font-bold">{selectedGuard.name}</h2>
                {getStatusBadge(selectedGuard.status)}
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-700">
              <div>
                <strong>Email:</strong>
                <p>{selectedGuard.email}</p>
              </div>

              <div>
                <strong>Phone:</strong>
                <p>{selectedGuard.phone}</p>
              </div>

              <div>
                <strong>Joined:</strong>
                <p>{new Date(selectedGuard.joinDate).toLocaleDateString()}</p>
              </div>

              <div>
                <strong>Status:</strong>
                <p className="capitalize">{selectedGuard.status}</p>
              </div>

              <div className="sm:col-span-2">
                <strong>Assigned School:</strong>
                <p>{selectedGuard.assignedSchool}</p>
              </div>
            </div>

            {/* Actions */}
            {selectedGuard.status === "pending" && (
              <div className="flex gap-3 mt-6">
                <Button
                  variant="primary"
                  className="flex-1"
                  disabled={selectedId === selectedGuard.id}
                  onClick={() => {
                    handleApprove(selectedGuard.id);
                    setSelectedGuard(null);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {selectedId === selectedGuard.id ? "Approving..." : "Approve"}
                </Button>

                <Button
                  variant="ghost"
                  className="flex-1"
                  disabled={selectedId === selectedGuard.id}
                  onClick={() => {
                    handleReject(selectedGuard.id);
                    setSelectedGuard(null);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {selectedId === selectedGuard.id ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
