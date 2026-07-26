import { useContext, useState, useEffect } from "react";
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
  Bus,
  Users,
  Clock,
  MapPin,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Eye,
  Activity,
  CalendarClock,
  Route,
} from "lucide-react";

// @ts-ignore
import userContext from "../../../context/userContext";

// @ts-ignore
import useActiveVans from "../../../hooks/guard/get/useActiveVans";

// @ts-ignore
import useRecentVerifiedStudents from "../../../hooks/guard/get/useRecentVerifiedStudents";

// @ts-ignore
import { socket } from "../../../sockets/socket";

export default function GuardDashboard() {
  const { user, logOut }: any = useContext(userContext);

  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [routeStatuses, setRouteStatuses] = useState<any>({});

  const {
    data: activeVansData,
    isLoading: activeVansLoading,
    error: activeVansError,
  } = useActiveVans();

  const {
    data: recentStudents,
    isLoading: allStudentsLoading,
    error: allStudentsError,
  } = useRecentVerifiedStudents();

  const studentsData = recentStudents?.students || [];

  const activeSchedules = activeVansData?.schedule || [];

  const activeVansCount = Array.isArray(activeSchedules)
    ? activeSchedules.length
    : 0;

  const pendingStudentsCount = Array.isArray(studentsData)
    ? studentsData.length
    : 0;

  // =========================
  // SOCKETS
  // =========================

  useEffect(() => {
    const handler = (data: any) => {
      console.log("new delay", data);
      setAlerts((prev) => [data, ...prev]);
    };

    socket.on("new-delay", handler);

    return () => {
      socket.off("new-delay", handler);
    };
  }, []);

  // join van rooms dynamically
  useEffect(() => {
    if (!activeSchedules?.length) return;

    const vanIds = activeSchedules
      .map((item: any) => item.van_id)
      .filter(Boolean);

    vanIds.forEach((vanId: number) => {
      socket.emit("join-van-room", vanId);
      console.log("Joined Van Room:", vanId);
    });

    return () => {
      vanIds.forEach((vanId: number) => {
        socket.emit("leave-van-room", vanId);
        console.log("Left Van Room:", vanId);
      });
    };
  }, [activeSchedules]);

  // route status updates
  useEffect(() => {
    if (!user?.id) return;

    socket.emit("join-guard-room", user.id);

    const handler = (data: any) => {
      console.log("Route Status Update:", data);

      setRouteStatuses((prev: any) => ({
        ...prev,
        [data.vanId]: data.vanStatus,
      }));
    };

    socket.on("route-status", handler);

    return () => {
      socket.off("route-status", handler);
    };
  }, [user]);

  // =========================
  // STATS
  // =========================

  const stats = [
    {
      title: "Today's Vans",
      value: activeVansLoading ? "..." : activeVansCount,
      icon: Bus,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Pending Students",
      value: allStudentsLoading ? "..." : pendingStudentsCount,
      icon: Users,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Active Routes",
      value: activeVansLoading ? "..." : activeVansCount,
      icon: Route,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "On-Time Rate",
      value: "94%",
      icon: TrendingUp,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  // =========================
  // HELPERS
  // =========================

  const getRouteStatus = (schedule: any) => {
    return routeStatuses[schedule.van_id] || schedule.status;
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "verified":
        return "success";

      case "on-route":
      case "ongoing":
      case "pending":
        return "warning";

      default:
        return "secondary";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar
        userRole={user?.role || "Guest"}
        userName={user?.full_name || "Guard"}
        userEmail={user?.email || "guard@example.com"}
        logOut={logOut}
      />

      {/* Main */}
      <div className="flex-1 overflow-hidden">
        <Header
          title="Guard Dashboard"
          subtitle={`Welcome back, ${
            user?.full_name || "Guard"
          }. Monitor routes and student verification in real-time.`}
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-4 md:p-6 space-y-6">
          {/* ========================= */}
          {/* STATS */}
          {/* ========================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-500 font-medium">
                        {stat.title}
                      </p>

                      <h2 className="text-3xl font-bold text-neutral-900 mt-2">
                        {stat.value}
                      </h2>
                    </div>

                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.iconBg}`}
                    >
                      <stat.icon
                        className={`w-7 h-7 ${stat.iconColor}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ========================= */}
          {/* MAIN GRID */}
          {/* ========================= */}

          <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
            {/* LEFT */}
            <div className="2xl:col-span-8 space-y-6">
              {/* ========================= */}
              {/* ROUTES */}
              {/* ========================= */}

              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">
                        Today's Routes
                      </CardTitle>

                      <CardDescription>
                        Live route monitoring and van activity
                      </CardDescription>
                    </div>

                    <Badge variant="primary" className="px-3 py-1">
                      {activeVansCount} Active
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-5">
                  {activeVansLoading && (
                    <div className="py-10 text-center text-neutral-500">
                      Loading schedules...
                    </div>
                  )}

                  {activeVansError && (
                    <div className="py-10 text-center text-red-500">
                      Failed to load schedules
                    </div>
                  )}

                  {!activeVansLoading &&
                    activeSchedules?.length > 0 && (
                      <div className="space-y-5">
                        {activeSchedules.map(
                          (schedule: any, idx: number) => {
                            const currentStatus =
                              getRouteStatus(schedule);

                            return (
                              <div
                                key={idx}
                                className="border border-neutral-200 rounded-2xl p-5 bg-white hover:shadow-md transition-all duration-300"
                              >
                                {/* Header */}
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                                  <div>
                                    <h3 className="text-lg font-semibold text-neutral-900">
                                      {schedule.route_name}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-neutral-600">
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                          {schedule.start_time} -{" "}
                                          {schedule.end_time}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Bus className="w-4 h-4" />
                                        <span>
                                          {schedule.total_vans} Van
                                          {schedule.total_vans > 1
                                            ? "s"
                                            : ""}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>
                                          {
                                            schedule.total_students
                                          }{" "}
                                          Students
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <Badge
                                    variant={getStatusVariant(
                                      currentStatus,
                                    )}
                                    className="capitalize px-3 py-1 h-fit"
                                  >
                                    {currentStatus}
                                  </Badge>
                                </div>

                                {/* Live Route Status */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                      </div>

                                      <div>
                                        <p className="text-xs text-neutral-500">
                                          Live Status
                                        </p>

                                        <p className="font-semibold capitalize">
                                          {currentStatus}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-green-600" />
                                      </div>

                                      <div>
                                        <p className="text-xs text-neutral-500">
                                          Route Type
                                        </p>

                                        <p className="font-semibold">
                                          School Transport
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <CalendarClock className="w-5 h-5 text-orange-600" />
                                      </div>

                                      <div>
                                        <p className="text-xs text-neutral-500">
                                          Updated
                                        </p>

                                        <p className="font-semibold">
                                          Live
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setSelectedSchedule(schedule)
                                    }
                                    className="sm:w-auto w-full"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                </CardContent>
              </Card>

              {/* ========================= */}
              {/* STUDENT VERIFICATIONS */}
              {/* ========================= */}

              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b">
                  <CardTitle>
                    Student Verifications
                  </CardTitle>

                  <CardDescription>
                    Latest verification activities
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5">
                  {allStudentsLoading && (
                    <div className="py-10 text-center text-neutral-500">
                      Loading student data...
                    </div>
                  )}

                  {allStudentsError && (
                    <div className="py-10 text-center text-red-500">
                      Failed to load students
                    </div>
                  )}

                  {!allStudentsLoading && (
                    <div className="space-y-4">
                      {studentsData?.length > 0 ? (
                        studentsData.map(
                          (verification: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border border-neutral-200 rounded-2xl p-4 hover:bg-slate-50 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                    verification.verification_type ===
                                    "VERIFIED"
                                      ? "bg-green-100"
                                      : "bg-orange-100"
                                  }`}
                                >
                                  {verification.verification_type ===
                                  "VERIFIED" ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                  ) : (
                                    <Clock className="w-6 h-6 text-orange-600" />
                                  )}
                                </div>

                                <div>
                                  <h4 className="font-semibold text-neutral-900">
                                    {verification.full_name}
                                  </h4>

                                  <p className="text-sm text-neutral-500">
                                    Student ID: {verification.id}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="text-sm text-neutral-500">
                                  {verification?.verification_time
                                    ? new Date(
                                        verification.verification_time,
                                      ).toLocaleString()
                                    : "Not Verified"}
                                </span>

                                <Badge
                                  variant={getStatusVariant(
                                    verification.verification_type,
                                  )}
                                >
                                  {
                                    verification.verification_type
                                  }
                                </Badge>
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <div className="py-10 text-center text-neutral-500">
                          No verification records found
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="2xl:col-span-4 space-y-6">
              {/* ========================= */}
              {/* ALERTS */}
              {/* ========================= */}

              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b">
                  <CardTitle>Active Alerts</CardTitle>

                  <CardDescription>
                    Real-time route notifications
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5">
                  <div className="space-y-4">
                    {alerts?.length > 0 ? (
                      alerts.map((alert: any, idx: number) => (
                        <div
                          key={idx}
                          className="border border-orange-200 bg-orange-50 rounded-2xl p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="w-5 h-5 text-orange-600" />
                            </div>

                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-900">
                                {alert.reason}
                              </h4>

                              <p className="text-sm text-neutral-600 mt-1">
                                {alert.comments}
                              </p>

                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 w-full"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h3 className="font-semibold text-neutral-900">
                          No Active Alerts
                        </h3>

                        <p className="text-sm text-neutral-500 mt-1">
                          Everything is running smoothly
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ========================= */}
          {/* MODAL */}
          {/* ========================= */}

          {selectedSchedule && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <Card className="w-full max-w-3xl rounded-3xl border-0 shadow-2xl overflow-hidden">
                <CardHeader className="border-b bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {selectedSchedule.route_name}
                      </CardTitle>

                      <CardDescription className="mt-1">
                        Complete route details and statistics
                      </CardDescription>
                    </div>

                    <button
                      onClick={() => setSelectedSchedule(null)}
                      className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 transition-all text-lg"
                    >
                      ✕
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-slate-50 rounded-2xl p-5">
                      <p className="text-sm text-neutral-500 mb-2">
                        Route Status
                      </p>

                      <Badge
                        variant={getStatusVariant(
                          selectedSchedule.status,
                        )}
                      >
                        {selectedSchedule.status}
                      </Badge>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5">
                      <p className="text-sm text-neutral-500 mb-2">
                        Route Timing
                      </p>

                      <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                        <Clock className="w-4 h-4" />
                        {selectedSchedule.start_time} -{" "}
                        {selectedSchedule.end_time}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="border rounded-2xl p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                          <Bus className="w-6 h-6 text-blue-600" />
                        </div>

                        <div>
                          <p className="text-sm text-neutral-500">
                            Total Vans
                          </p>

                          <h3 className="text-2xl font-bold">
                            {selectedSchedule.total_vans}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-2xl p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                          <Users className="w-6 h-6 text-green-600" />
                        </div>

                        <div>
                          <p className="text-sm text-neutral-500">
                            Total Students
                          </p>

                          <h3 className="text-2xl font-bold">
                            {selectedSchedule.total_students}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedSchedule.route_details && (
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-3">
                        Route Details
                      </h4>

                      <div className="bg-slate-50 rounded-2xl p-5 text-neutral-700 leading-relaxed">
                        {selectedSchedule.route_details}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedSchedule(null)}
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}