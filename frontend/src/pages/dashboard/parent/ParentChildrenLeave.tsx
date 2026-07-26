import React, { useContext, useMemo, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "react-toastify";
// @ts-ignore
import userContext from "../../../context/userContext";
// @ts-ignore
import useLeave from "../../../hooks/parents/post/useLeave";
// @ts-ignore
import { useChildrenForLeave } from "../../../hooks/parents/get/useChildrenForLeave";
// @ts-ignore
import { useLeaveHistory } from "../../../hooks/parents/get/useLeaveHistory";
//@ts-ignore
import { socket } from "../../../sockets/socket";

const REASON_OPTIONS = [
  { value: "Sick", label: "Sick" },
  { value: "Family", label: "Family event" },
  { value: "Vacation", label: "Vacation" },
  { value: "Appointment", label: "Medical appointment" },
  { value: "Other", label: "Other" },
];

const ParentChildrenLeave = () => {
  const { user, logOut }: any = useContext(userContext);
  const [selectedChildId, setSelectedChildId] = useState<string>("all");
  const [reason, setReason] = useState<string>("Sick");
  const [customReason, setCustomReason] = useState<string>("");
  const [leaveDays, setLeaveDays] = useState<number>(1);
  const [leaveDate, setLeaveDate] = useState<string>("");
  const today = new Date();
  const localDate = today.toLocaleDateString("en-CA");

  const leaveMutation = useLeave();
  const { data, isLoading, isError } = useChildrenForLeave();
  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
  } = useLeaveHistory();

  const children = useMemo(() => {
    const payload = data ?? data;
    if (Array.isArray(payload)) return payload;
    if (payload?.children && Array.isArray(payload.children))
      return payload.children;
    return [];
  }, [data]);

  const leaveHistory = useMemo(() => {
    const payload = historyData ?? [];
    if (Array.isArray(payload)) return payload;
    if (payload?.data && Array.isArray(payload.data)) return payload.data;
    return [];
  }, [historyData]);

  const selectedChild = useMemo(
    () => children.find((child: any) => `${child.id}` === selectedChildId),
    [children, selectedChildId],
  );

  const isSubmitting = leaveMutation.isPending;

  const getReasonValue = () => {
    if (reason === "Other") {
      return customReason.trim();
    }
    return reason;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const reasonValue = getReasonValue();
    if (!reasonValue) {
      toast.error("Please provide a valid leave reason.");
      return;
    }

    if (!leaveDays || leaveDays < 1) {
      toast.error("Leave days must be at least 1.");
      return;
    }

    if (!children.length) {
      toast.error("No eligible children found for leave requests.");
      return;
    }

    if (!leaveDate) {
      toast.error("Please select a valid leave date.");
      return;
    }

    if (leaveDate < localDate) {
      toast.error("You cannot select a past date");
      return;
    }

    try {
      if (selectedChildId === "all") {
        let childIds = children.map((child: any) => child.id);
        await leaveMutation.mutateAsync({
          childIds: childIds,
          reason: reasonValue,
          leave_days: leaveDays,
          leave_date: leaveDate,
          isMultiple: true,
        });
        toast.success(
          `Leave request submitted for ${children.length} child${
            children.length === 1 ? "" : "ren"
          }.`,
        );

        if (user) {
          socket.emit("child-on-leave", {
            childName: selectedChild.full_name,
            leaveDate: leaveDate,
            leaveDays: leaveDays,
          });
        }
      } else {
        console.log("leave date", leaveDate);
        await leaveMutation.mutateAsync({
          childId: selectedChildId,
          reason: reasonValue,
          leave_days: leaveDays,
          leave_date: leaveDate,
          isMultiple: false,
        });
        toast.success("Leave request submitted successfully!");
        if (user) {
          socket.emit("child-on-leave", {
            childName: selectedChild.full_name,
            leaveDate: leaveDate,
            leaveDays: leaveDays,
          });
        }
      }

      setSelectedChildId("all");
      setReason("Sick");
      setLeaveDays(1);
      setCustomReason("");
    } catch (error) {
      // useLeave already handles error toast, but fallback just in case
      if (error instanceof Error) {
        toast.error(error.message || "Failed to submit leave request.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "parent"}
        userName={user?.full_name || "Parent"}
        userEmail={user?.email || "parent@example.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header
          title="Children Leave"
          subtitle="Submit leave for one child or all registered children."
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-4 sm:p-6 max-w-[1440px] mx-auto w-full space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="shadow-sm">
              <CardHeader className="p-6">
                <CardTitle>Request leave</CardTitle>
                <CardDescription>
                  Select a child or apply the request to all children, choose a
                  reason, and enter leave duration.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <form className="grid gap-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Child selection
                      </label>
                      <select
                        aria-label="Select child or all children"
                        value={selectedChildId}
                        onChange={(event) =>
                          setSelectedChildId(event.target.value)
                        }
                        className="select select-bordered w-full"
                      >
                        <option value="all">All children</option>
                        {children.map((child: any) => (
                          <option key={child.id} value={`${child.id}`}>
                            {child.full_name ||
                              child.name ||
                              `Child ${child.id}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Reason for leave
                      </label>
                      <select
                        aria-label="Select leave reason"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        className="select select-bordered w-full"
                      >
                        {REASON_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {reason === "Other" && (
                    <div className="w-full">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Custom reason
                      </label>
                      <textarea
                        rows={4}
                        value={customReason}
                        onChange={(event) =>
                          setCustomReason(event.target.value)
                        }
                        className="textarea textarea-bordered w-full"
                        placeholder="Describe the reason for leave"
                      />
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Leave days"
                      type="number"
                      min={1}
                      step={1}
                      value={leaveDays}
                      onChange={(event) =>
                        setLeaveDays(Number(event.target.value))
                      }
                      className="w-full"
                    />
                    <Input
                      label="Leave date"
                      type="date"
                      value={leaveDate}
                      min={localDate}
                      onChange={(event) => setLeaveDate(event.target.value)}
                      className="w-full"
                    />

                    <div className="w-full">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Selected child summary
                      </label>
                      <div className="rounded-xl border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-700 min-h-[64px]">
                        {selectedChildId === "all" ? (
                          <>
                            Applying leave to <strong>{children.length}</strong>{" "}
                            child{children.length === 1 ? "" : "ren"}.
                          </>
                        ) : selectedChild ? (
                          <>
                            {selectedChild.full_name || selectedChild.name}
                            <span className="block text-xs text-neutral-500 mt-1">
                              ID: {selectedChild.id}
                            </span>
                          </>
                        ) : (
                          <span className="text-neutral-500">
                            No child selected.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardFooter className="p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-neutral-600">
                      {children.length
                        ? `You have ${children.length} eligible child${children.length === 1 ? "" : "ren"}.`
                        : "No children available currently."}
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !children.length}
                      isLoading={isSubmitting}
                    >
                      Submit leave request
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="p-6">
                <CardTitle>Children available for leave</CardTitle>
                <CardDescription>
                  This list shows the children you can submit leave requests
                  for.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {isLoading ? (
                  <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center text-neutral-600">
                    Loading children...
                  </div>
                ) : isError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
                    Failed to load children. Please refresh the page.
                  </div>
                ) : !children.length ? (
                  <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center text-neutral-500">
                    No child data available for leave requests.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {children.map((child: any) => (
                      <div
                        key={child.id}
                        className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-base font-semibold text-neutral-900">
                              {child.full_name ||
                                child.name ||
                                `Child ${child.id}`}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {child.grade ? `${child.grade} • ` : ""}
                              {child.gender ? `${child.gender}` : ""}
                            </p>
                          </div>
                          <div className="text-sm text-neutral-600">
                            ID: {child.id}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="p-6">
              <CardTitle>Leave History</CardTitle>
              <CardDescription>
                View all previous leave requests and their status.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {historyLoading ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center text-neutral-600">
                  Loading leave history...
                </div>
              ) : historyError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
                  Failed to load leave history. Please refresh the page.
                </div>
              ) : !leaveHistory.length ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center text-neutral-500">
                  No leave history available.
                </div>
              ) : (
                <div className="grid gap-4">
                  {leaveHistory.map((leave: any) => (
                    <div
                      key={leave.id || `${leave.child_id}-${leave.created_at}`}
                      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-base font-semibold text-neutral-900">
                              {leave.child_name ||
                                leave.child_full_name ||
                                `Child ${leave.id}`}
                            </p>
                            {/* <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                leave.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : leave.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {leave.status || "pending"}
                            </span> */}
                          </div>
                          <p className="text-sm text-neutral-600 mb-1">
                            <strong>Reason:</strong> {leave.reason}
                          </p>
                          <p className="text-sm text-neutral-600 mb-1">
                            <strong>Days:</strong>{" "}
                            {leave.leave_days || leave.days}
                          </p>
                          <p className="text-sm text-neutral-500">
                            <strong>Requested:</strong>{" "}
                            {leave.leave_date
                              ? new Date(leave.leave_date).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ParentChildrenLeave;
