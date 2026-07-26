import { useContext, useMemo, useState } from "react";
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
  Users,
  UserCheck,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Star,
} from "lucide-react";
// @ts-ignore
import userContext from "../../../context/userContext";
// @ts-ignore
import useNewDriversExceptCurrent from "../../../hooks/drivers/get/useNewDriversExceptCurrent";
// @ts-ignore
import useAssignedDriversHistory from "../../../hooks/drivers/get/useAssignedDriversHistory";
// @ts-ignore
import useLeaveDriver from "../../../hooks/drivers/useLeaveDriver";
// @ts-ignore
import useRestoreDriver from "../../../hooks/drivers/useRestoreDriver";
// @ts-ignore
import { getFileUrl } from "../../../api/apiConstant";
import { Input } from "@/components/ui/Input";
//@ts-ignore
import { socket } from "../../../sockets/socket";

const DriverLeaves = () => {
  const { user, logOut }: any = useContext(userContext);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  const [reason, setReason] = useState("");
  const [leaveDays, setLeaveDays] = useState("");
  const [leaveDate, setLeaveDate] = useState("");

  const {
    data: newDriversData,
    isLoading: newDriversLoading,
    isError: newDriversError,
  } = useNewDriversExceptCurrent();
  const {
    data: assignedHistoryData,
    isLoading: historyLoading,
    isError: historyError,
  } = useAssignedDriversHistory();
  const leaveDriverMutation = useLeaveDriver();
  const restoreDriverMutation = useRestoreDriver();

  const newDrivers = useMemo(() => {
    const payload = newDriversData?.data ?? newDriversData;
    if (Array.isArray(payload)) return payload;
    if (payload?.drivers && Array.isArray(payload.drivers))
      return payload.drivers;
    return [];
  }, [newDriversData]);

  const assignedHistory = useMemo(() => {
    const payload = assignedHistoryData?.data ?? assignedHistoryData;
    if (Array.isArray(payload)) return payload;
    if (payload?.history && Array.isArray(payload.history))
      return payload.history;
    return [];
  }, [assignedHistoryData]);

  const isRestoring = restoreDriverMutation.isPending;
  //   const isAssigning = leaveDriverMutation.isPending;

  const handleRestoreDriver = async (driverId: string) => {
    try {
      await restoreDriverMutation.mutateAsync({ newDriverId: driverId });
      if (user) {
        socket.emit("driver-restore", {
          driverName: user?.full_name,
        });
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAssignNewDriver = async () => {
    if (!reason || !leaveDays || !leaveDate) {
      alert("All fields are required");
      return;
    }

    try {
      await leaveDriverMutation.mutateAsync({
        newDriverId: selectedDriverId,
        reason,
        leaveDays,
        leaveDate,
      });

      if (user) {
        socket.emit("driver-on-leave", {
          driverName: user?.full_name,
          leaveDate: leaveDate,
          leaveDays: leaveDays,
        });
      }

      // reset
      setShowAssignModal(false);
      setReason("");
      setLeaveDays("");
      setLeaveDate("");
      setSelectedDriverId(null);
    } catch (error) {}
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "driver"}
        userName={user?.full_name || "Driver"}
        userEmail={user?.email || "driver@example.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header
          title="Driver Management"
          subtitle="Manage driver assignments, view history, and restore previous drivers."
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-4 sm:p-6 max-w-[1440px] mx-auto w-full space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Total Assigned
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {assignedHistory.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Available Drivers
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {newDrivers.length}
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Active Drivers
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {
                        assignedHistory.filter(
                          (driver: any) => driver.is_active,
                        ).length
                      }
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Restorations
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {
                        assignedHistory?.length
                      }
                    </p>
                  </div>
                  <RotateCcw className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Assigned Drivers History */}
          <Card className="shadow-sm">
            <CardHeader className="p-6">
              <CardTitle>Assigned Drivers History</CardTitle>
              <CardDescription>
                View all previously assigned drivers and their current status.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {historyLoading ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center text-neutral-600">
                  Loading driver history...
                </div>
              ) : historyError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
                  Failed to load driver history. Please refresh the page.
                </div>
              ) : !assignedHistory.length ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center text-neutral-500">
                  No driver assignment history available.
                </div>
              ) : (
                <div className="grid gap-4">
                  {assignedHistory.map((driver: any) => (
                    <div
                      key={
                        driver.id || `${driver.driver_id}-${driver.assigned_at}`
                      }
                      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar
                            src={getFileUrl(
                              driver.profile_photo || driver.driver_photo,
                            )}
                            name={
                              driver.full_name || driver.driver_name || "Driver"
                            }
                            size="lg"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-base font-semibold text-neutral-900 capitalize">
                                {driver.full_name ||
                                  driver.driver_name ||
                                  "Driver Name"}
                              </p>
                              {getStatusIcon(
                                driver.is_active ? "active" : "inactive",
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-600">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {driver.email || "N/A"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {driver.phone || driver.contact || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                className={getStatusColor(
                                  driver.is_active ? "active" : "inactive",
                                )}
                              >
                                {driver.is_active ? "Active" : "Inactive"}
                              </Badge>
                              {driver.assigned_at && (
                                <span className="text-xs text-neutral-500">
                                  Assigned:{" "}
                                  {new Date(
                                    driver.assigned_at,
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRestoreDriver(driver.id || driver.driver_id)
                            }
                            disabled={isRestoring}
                            isLoading={isRestoring}
                            className="flex items-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Restore
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Drivers Available */}
          <Card className="shadow-sm">
            <CardHeader className="p-6">
              <CardTitle>New Drivers Available</CardTitle>
              <CardDescription>
                Assign new drivers to routes when needed.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {newDriversLoading ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center text-neutral-600">
                  Loading available drivers...
                </div>
              ) : newDriversError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
                  Failed to load available drivers. Please refresh the page.
                </div>
              ) : !newDrivers.length ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center text-neutral-500">
                  No new drivers available for assignment.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {newDrivers.map((driver: any) => (
                    <div
                      key={driver.id}
                      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col items-center text-center gap-4">
                        <Avatar
                          src={getFileUrl(
                            driver.profile_photo || driver.driver_photo,
                          )}
                          name={
                            driver.full_name || driver.driver_name || "Driver"
                          }
                          size="xl"
                        />
                        <div>
                          <p className="text-lg font-semibold text-neutral-900 mb-1 capitalize">
                            {driver.full_name ||
                              driver.driver_name ||
                              "Driver Name"}
                          </p>
                          <div className="text-sm text-neutral-600 space-y-1">
                            <p className="flex items-center justify-center gap-1">
                              <Mail className="w-4 h-4" />
                              {driver.email || "N/A"}
                            </p>
                            <p className="flex items-center justify-center gap-1">
                              <Phone className="w-4 h-4" />
                              {driver.phone || driver.contact || "N/A"}
                            </p>
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-3">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium">
                              {Number(driver?.rating)?.toFixed(0) || "0.0"}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedDriverId(driver.id || driver.driver_id);
                            setShowAssignModal(true);
                          }}
                          //   disabled={isAssigning}
                          //   isLoading={isAssigning}
                          className="w-full flex items-center gap-2"
                        >
                          <UserCheck className="w-4 h-4" />
                          Assign Driver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* show modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Assign Driver</h3>
                <button onClick={() => setShowAssignModal(false)}>✕</button>
              </div>

              <div>
                <label className="text-sm">Reason</label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason"
                />
              </div>

              <div>
                <label className="text-sm">Leave Days</label>
                <Input
                  type="number"
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(e.target.value)}
                  placeholder="Enter days"
                />
              </div>

              <div>
                <label className="text-sm">Leave Date</label>
                <Input
                  type="date"
                  value={leaveDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setLeaveDate(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleAssignNewDriver}
                  disabled={leaveDriverMutation.isPending}
                >
                  {leaveDriverMutation.isPending ? "Assigning..." : "Submit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DriverLeaves;
