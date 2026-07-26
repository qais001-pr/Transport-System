import { useEffect, useState } from "react";
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
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  Route,
  Star,
  Navigation,
  X,
} from "lucide-react";
import { useContext } from "react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useMyRoutes from "../../../hooks/drivers/get/useMyRoutes";
//@ts-ignore
import useAssignedStudents from "../../../hooks/drivers/get/useAssignedStudents";
//@ts-ignore
import { usePush } from "../../../push_notifications/subscribe";

export default function DriverDashboard() {
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { user, logOut }: any = useContext(userContext);

  const { data: routesData, isLoading: routesLoading } = useMyRoutes();
  usePush(user?.id);

  // normalize routes array from API response
  const routesArray = Array.isArray(routesData)
    ? routesData
    : routesData?.routes || routesData?.data || [];

  // pick current route (first route) to fetch assigned students
  const currentRoute =
    routesArray && routesArray.length > 0 ? routesArray[0] : null;

  const { data: assignedStudentsData, isLoading: studentsLoading } =
    useAssignedStudents(currentRoute?.id);

  const studentsArray = Array.isArray(assignedStudentsData)
    ? assignedStudentsData
    : assignedStudentsData?.students || assignedStudentsData?.data || [];

  const stats = [
    {
      title: "Active Students",
      value: studentsArray?.length || 0,
      change: "+2",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary-50",
    },
    {
      title: "Today's Routes",
      value: routesArray?.length || 0,
      change: "0",
      icon: Route,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
    {
      title: "This Month",
      value: "Rs.2,450",
      change: "+12%",
      icon: DollarSign,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
    },
    {
      title: "Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  // const delayReasons = [
  //   { icon: "🚗", label: "Traffic Jam", value: "traffic" },
  //   { icon: "⚠️", label: "Accident", value: "accident" },
  //   { icon: "🔧", label: "Vehicle Issue", value: "vehicle" },
  //   { icon: "⛽", label: "Fuel Issue", value: "fuel" },
  // ];

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
          title="Driver Dashboard"
          subtitle={`Welcome back, ${
            user?.full_name || "Zaman Ali"
          }! Here's what's happening today.`}
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <Badge variant="success" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-neutral-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Active Route Control */}
          {/* <Card className="mb-8 bg-gradient-to-br from-primary to-secondary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {isOnRoute ? "Route in Progress" : "Ready to Start Route"}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {isOnRoute
                      ? "Morning Pickup - Route A • 3 of 8 stops completed"
                      : "Next: Morning Pickup at 7:00 AM"}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant={isOnRoute ? "accent" : "secondary"}
                      size="lg"
                      onClick={() => setIsOnRoute(!isOnRoute)}
                      className="bg-white text-primary hover:bg-neutral-100"
                    >
                      {isOnRoute ? (
                        <>
                          <Square className="w-5 h-5" />
                          End Route
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Start Route
                        </>
                      )}
                    </Button>
                    {isOnRoute && (
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-white text-white hover:bg-white/10"
                      >
                        <AlertTriangle className="w-5 h-5" />
                        Report Delay
                      </Button>
                    )}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Navigation className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Today's Schedule</CardTitle>
                      <CardDescription>Your routes for today</CardDescription>
                    </div>
                    <Badge variant="primary">
                      {routesLoading ? "..." : routesArray.length} Routes
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {routesLoading ? (
                      <div>Loading routes...</div>
                    ) : routesArray.length === 0 ? (
                      <div>No routes for today.</div>
                    ) : (
                      routesArray.map((route: any) => {
                        const id = route.id || route._id || route.route_id;
                        const title =
                          route.name ||
                          route.type ||
                          route.route_name ||
                          "Route";
                        const schoolObj = route.school || {};
                        const routeLabel =
                          schoolObj.address ||
                          route.route ||
                          route.title ||
                          title;
                        const startTime =
                          route.start_time || schoolObj.start_time || "—";
                        const endTime =
                          route.end_time || schoolObj.end_time || "—";
                        const time = `${startTime} - ${endTime}`;
                        const studentsCount =
                          parseInt(route.total_students) ||
                          route.students_count ||
                          route.assigned_students_count ||
                          0;
                        const stopsCount =
                          parseInt(route.total_stops) ||
                          (Array.isArray(route.stops)
                            ? route.stops.length
                            : 0) ||
                          0;
                        const status = route.is_active ? "active" : "upcoming";

                        return (
                          <div
                            key={id || title}
                            className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-neutral-900 mb-1">
                                  {title || "No Route"}...
                                </h4>
                                <p className="text-sm text-neutral-600">
                                  {routeLabel}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  status === "completed"
                                    ? "success"
                                    : status === "active"
                                      ? "warning"
                                      : "secondary"
                                }
                              >
                                {status === "completed" ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : null}
                                {String(status).charAt(0).toUpperCase() +
                                  String(status).slice(1)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-neutral-500" />
                                <span className="text-neutral-700">{time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-neutral-500" />
                                <span className="text-neutral-700">
                                  {studentsCount} Students
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-neutral-500" />
                                <span className="text-neutral-700">
                                  {stopsCount} Stops
                                </span>
                              </div>
                            </div>

                            {status !== "completed" && (
                              <div className="flex gap-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => {
                                    window.location.href = `/dashboard/driver/tracking`;
                                  }}
                                >
                                  <Navigation className="w-4 h-4" />
                                  Start Navigation
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRoute(route);
                                    setShowDetailsModal(true);
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Students List */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Current Route Students</CardTitle>
                  <CardDescription>
                    Track pickup/drop-off status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentsLoading ? (
                      <div>Loading students...</div>
                    ) : studentsArray.length === 0 ? (
                      <div>No students assigned to this route.</div>
                    ) : (
                      studentsArray.map((student: any) => {
                        const sid =
                          student.id || student._id || student.student_id;
                        const name =
                          student.full_name ||
                          student.name ||
                          student.student_name ||
                          "Student";
                        const pickup =
                          student.pickup_time ||
                          student.pickup ||
                          student.scheduled_pickup ||
                          "-";
                        const location = student.pickup_address || "-";
                        const status =
                          student.status || student.pickup_status || "pending";

                        return (
                          <div
                            key={sid || name}
                            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar name={name} size="md" />
                              <div>
                                <p className="font-medium text-neutral-900">
                                  {name}
                                </p>
                                <p className="text-xs text-neutral-600">
                                  {location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-neutral-600">
                                {pickup}
                              </span>
                              {String(status) === "picked" ? (
                                <Badge variant="success">
                                  <CheckCircle className="w-3 h-3" />
                                  Picked
                                </Badge>
                              ) : (
                                <Button variant="primary" size="sm">
                                  Pick Up
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div>
              {/* Quick Delay Report */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Report Delay</CardTitle>
                  <CardDescription>Quick delay notification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {delayReasons.map((reason) => (
                      <button
                        key={reason.value}
                        className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors text-center"
                      >
                        <div className="text-3xl mb-2">{reason.icon}</div>
                        <p className="text-xs font-medium text-neutral-700">
                          {reason.label}
                        </p>
                      </button>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-3">
                    <AlertTriangle className="w-4 h-4" />
                    Custom Reason
                  </Button>
                </CardContent>
              </Card> */}

              {/* Earnings Summary */}
              {/* <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Earnings Summary</CardTitle>
                  <CardDescription>This month's performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-600">
                          Total Earnings
                        </span>
                        <span className="text-lg font-bold text-neutral-900">
                          $2,450
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: "75%" }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        75% of monthly target
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">
                          Completed Trips
                        </span>
                        <span className="font-semibold text-neutral-900">
                          48
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">
                          Active Students
                        </span>
                        <span className="font-semibold text-neutral-900">
                          12
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">Average Rating</span>
                        <span className="font-semibold text-neutral-900 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-highlight text-highlight" />
                          4.8
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Quick Actions */}
              {/* <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Route className="w-4 h-4" />
                      View All Routes
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4" />
                      Student List
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4" />
                      Earnings Report
                    </Button>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </main>
      </div>

      {/* Route Details Modal */}
      {showDetailsModal && selectedRoute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Route Details</CardTitle>
                <CardDescription>Complete route information</CardDescription>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRoute(null);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Route Header */}
              <div className="border-b pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">
                      {selectedRoute.name ||
                        selectedRoute.type ||
                        selectedRoute.route_name ||
                        "Route"}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {selectedRoute.school?.address ||
                        selectedRoute.route ||
                        selectedRoute.title ||
                        "Location"}
                    </p>
                  </div>
                  <Badge
                    variant={selectedRoute.is_active ? "warning" : "secondary"}
                  >
                    {selectedRoute.is_active ? "Active" : "Upcoming"}
                  </Badge>
                </div>
              </div>

              {/* Timing Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Start Time</p>
                  <p className="font-semibold text-neutral-900">
                    {selectedRoute.start_time ||
                      selectedRoute.school?.start_time ||
                      "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">End Time</p>
                  <p className="font-semibold text-neutral-900">
                    {selectedRoute.end_time ||
                      selectedRoute.school?.end_time ||
                      "—"}
                  </p>
                </div>
              </div>

              {/* Route Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <Users className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-xs text-neutral-600">Students</p>
                    <p className="font-bold text-neutral-900">
                      {parseInt(selectedRoute.total_students) || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-neutral-600">Stops</p>
                    <p className="font-bold text-neutral-900">
                      {parseInt(selectedRoute.total_stops) ||
                        (Array.isArray(selectedRoute.stops)
                          ? selectedRoute.stops.length
                          : 0) ||
                        0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <Navigation className="w-5 h-5 text-highlight" />
                  <div>
                    <p className="text-xs text-neutral-600">Status</p>
                    <p className="font-bold text-neutral-900">
                      {selectedRoute.is_active ? "In Progress" : "Scheduled"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stops List */}
              {Array.isArray(selectedRoute.stops) &&
                selectedRoute.stops.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-neutral-900 mb-3">
                      Route Stops
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedRoute.stops.map((stop: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-2 bg-neutral-50 rounded-lg"
                        >
                          <div className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold flex-shrink-0">
                            {stop.sequence_no || idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900">
                              Stop {stop.sequence_no || idx + 1}
                            </p>
                            <p className="text-xs text-neutral-600">
                              {stop.latitude && stop.longitude
                                ? `${stop.latitude.toFixed(
                                    4,
                                  )}, ${stop.longitude.toFixed(4)}`
                                : stop.address || "No location"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="primary" className="flex-1">
                  <Navigation className="w-4 h-4" />
                  Start Navigation
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedRoute(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
