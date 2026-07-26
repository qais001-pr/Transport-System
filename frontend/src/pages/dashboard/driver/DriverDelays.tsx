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
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Car,
  Fuel,
  Construction,
  Cloud,
  Plus,
  Eye,
  TrendingDown,
  Calendar,
  MapPin,
  X,
} from "lucide-react";
import userContext from "../../../context/userContext";
import useDelayReports from "../../../hooks/drivers/get/useDelayReports";

export default function DriverDelays() {
  const [selectedDelay, setSelectedDelay] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { user, logOut }: any = useContext(userContext);
  const { data: delayData, isLoading, isError } = useDelayReports();

  // Normalize delays data from API
  const normalizedData = useMemo(() => {
    if (!delayData) {
      return { delays: [], delayReasons: [], stats: [] };
    }

    // Extract API data - handle both array and object responses
    const delayReports = Array.isArray(delayData)
      ? delayData
      : delayData.reports || [];

    // Helper to format date from ISO string
    const formatDate = (isoString: string) => {
      if (!isoString) return "Unknown";
      return new Date(isoString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    };

    // Helper to format time from ISO string or time string
    const formatTime = (dateOrTime: string) => {
      if (!dateOrTime) return "Unknown";
      if (dateOrTime.includes("T")) {
        return new Date(dateOrTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return dateOrTime; // Already a time string like "08:00:00"
    };

    // Reason icons mapping
    const reasonIconMap: { [key: string]: any } = {
      "Traffic congestion": Car,
      "Flat tire": Fuel,
      "Engine overheating": Construction,
      "Accident ahead": AlertTriangle,
      "Road construction": Construction,
      traffic: Car,
      vehicle: Construction,
      weather: Cloud,
      accident: AlertTriangle,
      fuel: Fuel,
    };

    const reasonColorMap: { [key: string]: string } = {
      "Traffic congestion": "text-accent",
      "Flat tire": "text-highlight",
      "Engine overheating": "text-accent",
      "Accident ahead": "text-accent",
      "Road construction": "text-highlight",
      traffic: "text-accent",
      vehicle: "text-highlight",
      weather: "text-secondary",
      accident: "text-accent",
      fuel: "text-highlight",
    };

    // Normalize delays
    const normalizedDelays = delayReports.map((d: any, idx: number) => ({
      id: d.id || idx + 1,
      date: formatDate(d.incident_date),
      time: formatTime(d.incident_time || d.incident_date),
      route: `${d.route_name}` || "Unknown Route",
      reason: d.reason || "Other",
      delayDuration: `${d.delay_minutes || 0} mins`,
      status: d.status?.toLowerCase() || "PENDING",
      location: d.location || "Unknown",
      affectedStudents: parseInt(d.students_affected || 0),
      details: d.comments || d.description || "No details provided",
      reportedAt: formatTime(d.reported_at),
      resolvedAt: d.resolved_at ? formatTime(d.resolved_at) : "-",
      icon:
        reasonIconMap[d.reason] ||
        reasonIconMap[d.reason?.toLowerCase()] ||
        AlertTriangle,
      color:
        reasonColorMap[d.reason] ||
        reasonColorMap[d.reason?.toLowerCase()] ||
        "text-neutral-600",
    }));

    // Calculate delay reasons stats
    const reasonStats: { [key: string]: number } = {};
    normalizedDelays.forEach((delay: any) => {
      reasonStats[delay.reason] = (reasonStats[delay.reason] || 0) + 1;
    });

    const totalDelays = normalizedDelays.length;
    const delayReasons = Object.entries(reasonStats)
      .map(([reason, count]: [string, number]) => ({
        reason,
        count,
        percentage:
          totalDelays > 0 ? Math.round((count / totalDelays) * 100) : 0,
        color: "bg-accent",
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate stats
    const thisMonthDelays = normalizedDelays.filter((d: any) => {
      const delayDate = new Date(d.date);
      const today = new Date();
      return (
        delayDate.getMonth() === today.getMonth() &&
        delayDate.getFullYear() === today.getFullYear()
      );
    }).length;

    const avgDelayTime =
      normalizedDelays.length > 0
        ? Math.round(
            normalizedDelays.reduce((sum: number, d: any) => {
              const match = d.delayDuration.match(/(\d+)/);
              return sum + (match ? parseInt(match[1]) : 0);
            }, 0) / normalizedDelays.length,
          )
        : 0;

    const onTimeRate =
      100 -
      (thisMonthDelays > 0 ? Math.round((thisMonthDelays / 25) * 100) : 0);

    const stats = [
      {
        title: "Total Delays",
        value: `${totalDelays}`,
        subtitle: "All time",
        icon: AlertTriangle,
        color: "text-accent",
        bgColor: "bg-accent-50",
      },
      {
        title: "This Month",
        value: `${thisMonthDelays}`,
        subtitle: new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        icon: Calendar,
        color: "text-highlight",
        bgColor: "bg-highlight-50",
      },
      {
        title: "Avg Delay Time",
        value: `${avgDelayTime} mins`,
        subtitle: "Average",
        icon: Clock,
        color: "text-secondary",
        bgColor: "bg-secondary-50",
      },
      {
        title: "On-Time Rate",
        value: `${onTimeRate}%`,
        subtitle: "This month",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
    ];

    return { delays: normalizedDelays, delayReasons, stats };
  }, [delayData]);

  const {
    delays: apiDelays,
    delayReasons: apiDelayReasons,
    stats,
  } = normalizedData;

  const displayDelays = apiDelays.length > 0 ? apiDelays : [];
  const displayDelayReasons = apiDelayReasons.length > 0 ? apiDelayReasons : [];

  return (
    <div className="flex min-h-screen bg-neutral-50 overflow-x-hidden">
      <Sidebar
        userRole={user?.role || "Guest"}
        userName={user?.full_name || "Zaman Ali"}
        userEmail={user?.email || "zaman.ali@example.com"}
        logOut={logOut}
      />

      <div className="flex-1 min-w-0">
        <Header
          title="Delay Reports"
          subtitle="Track and manage route delays"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        {isError && (
          <div className="p-6 bg-accent/10 border border-accent text-accent rounded-lg m-6">
            Failed to load delay reports. Showing cached data.
          </div>
        )}

        <main className="p-3 sm:p-4 md:p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-neutral-600">Loading delay reports...</p>
            </div>
          )}

          {!isLoading && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                {stats.map((stat, index) => (
                  <Card key={index} hover>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                        >
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-sm text-neutral-600">{stat.title}</p>
                      <p className="text-xs text-neutral-500">
                        {stat.subtitle}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Report Delay Button */}
              {/* <div className="mb-6">
                <Button variant="primary" size="lg">
                  <Plus className="w-5 h-5" />
                  Report New Delay
                </Button>
              </div> */}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                {/* Delay History */}
                <div className="xl:col-span-2 min-w-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delay History</CardTitle>
                      <CardDescription>
                        All reported delays and their status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {displayDelays?.length > 0 ? (
                          displayDelays.map((delay: any) => (
                            <div
                              key={delay.id}
                              className="p-4 border-2 border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-3">
                                <div className="flex flex-col sm:flex-row items-start gap-3 min-w-0 flex-1">
                                  <div
                                    className={`w-12 h-12 ${delay.color === "text-accent" ? "bg-accent-50" : delay.color === "text-highlight" ? "bg-highlight-50" : "bg-secondary-50"} rounded-lg flex items-center justify-center flex-shrink-0`}
                                  >
                                    <delay.icon
                                      className={`w-6 h-6 ${delay.color}`}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-neutral-900 break-words">
                                        {delay.reason}
                                      </h4>
                                      <Badge
                                        variant={
                                          delay.status === "resolved"
                                            ? "success"
                                            : delay.status === "pending"
                                              ? "warning"
                                              : "default"
                                        }
                                        className="text-xs"
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                        {delay.status === "resolved"
                                          ? "Resolved"
                                          : delay.status === "pending"
                                            ? "Pending"
                                            : "Unknown"}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-neutral-600 mb-2">
                                      {delay.route}
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-xs text-neutral-600">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{delay.date}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{delay.time}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{delay.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="lg:text-right">
                                  <p className="text-2xl font-bold text-accent">
                                    {delay.delayDuration}
                                  </p>
                                  <p className="text-xs text-neutral-500">
                                    Delay time
                                  </p>
                                </div>
                              </div>

                              <div className="p-3 bg-neutral-50 rounded-lg mb-3">
                                <p className="text-sm text-neutral-700">
                                  {delay.details}
                                </p>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-neutral-600">
                                  <span>Reported: {delay.reportedAt}</span>
                                  <span>•</span>
                                  <span>Resolved: {delay.resolvedAt}</span>
                                  <span>•</span>
                                  <span>
                                    {delay.affectedStudents} students affected
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full sm:w-auto"
                                  onClick={() => {
                                    setSelectedDelay(delay);
                                    setShowDetailsModal(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div>
                            <p>No Delay</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-4 md:space-y-6 min-w-0">
                  {/* Delay Breakdown */}
                  {/* <Card>
                    <CardHeader>
                      <CardTitle>Delay Reasons</CardTitle>
                      <CardDescription>Breakdown by cause</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {displayDelayReasons.map((item: any, index: number) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-neutral-900">
                                {item.reason}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-neutral-900">
                                  {item.count}
                                </span>
                                <span className="text-xs text-neutral-500">
                                  ({item.percentage}%)
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div
                                className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card> */}

                  {/* Monthly Trend */}
                  {/* <Card>
                    <CardHeader>
                      <CardTitle>Monthly Trend</CardTitle>
                      <CardDescription>Delays over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <span className="text-sm text-neutral-700">
                            October 2025
                          </span>
                          <span className="text-lg font-bold text-neutral-900">
                            3
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <span className="text-sm text-neutral-700">
                            September 2025
                          </span>
                          <span className="text-lg font-bold text-neutral-900">
                            5
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <span className="text-sm text-neutral-700">
                            August 2025
                          </span>
                          <span className="text-lg font-bold text-neutral-900">
                            4
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <span className="text-sm text-neutral-700">
                            July 2025
                          </span>
                          <span className="text-lg font-bold text-neutral-900">
                            6
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingDown className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-900">
                            Improving!
                          </span>
                        </div>
                        <p className="text-sm text-green-700">
                          40% reduction in delays this month
                        </p>
                      </div>
                    </CardContent>
                  </Card> */}

                  {/* Tips */}
                  <Card className="bg-secondary-50 border-2 border-secondary">
                    <CardHeader>
                      <CardTitle className="text-secondary">Pro Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-neutral-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                          <span>
                            Report delays immediately to notify parents
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                          <span>
                            Check traffic conditions before starting route
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                          <span>
                            Maintain vehicle regularly to avoid breakdowns
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                          <span>Keep emergency contact numbers handy</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Delay Details Modal */}
      {showDetailsModal && selectedDelay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-3 mb-2">
                  <selectedDelay.icon
                    className={`w-6 h-6 ${selectedDelay.color}`}
                  />
                  {selectedDelay.reason}
                </CardTitle>
                <CardDescription>Detailed delay information</CardDescription>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDelay(null);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedDelay.status === "resolved"
                      ? "success"
                      : selectedDelay.status === "pending"
                        ? "warning"
                        : "secondary"
                  }
                >
                  <CheckCircle className="w-3 h-3" />
                  {selectedDelay.status === "resolved"
                    ? "Resolved"
                    : selectedDelay.status === "pending"
                      ? "Pending"
                      : "Unknown"}
                </Badge>
              </div>

              {/* Delay Duration */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Delay Duration
                </h3>
                <div className="p-4 bg-accent-50 rounded-lg border-2 border-accent-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-accent">
                      {selectedDelay.delayDuration}
                    </span>
                    <span className="text-neutral-600">of delay</span>
                  </div>
                </div>
              </div>

              {/* Route & Location Information */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Route & Location
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">
                        Route
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedDelay.route}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">
                        Location
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedDelay.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time Information */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Incident Timing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-highlight flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-900">
                        Date
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedDelay.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-900">
                        Time
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedDelay.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Timeline */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Report Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">
                        Reported At
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedDelay.reportedAt}
                      </p>
                    </div>
                  </div>
                  {selectedDelay.resolvedAt !== "-" && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">
                          Resolved At
                        </p>
                        <p className="text-sm text-neutral-600">
                          {selectedDelay.resolvedAt}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Description */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Description
                </h3>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-700">
                    {selectedDelay.details}
                  </p>
                </div>
              </div>

              {/* Affected Students */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Impact</h3>
                <div className="p-4 bg-highlight-50 rounded-lg border border-highlight-100">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-highlight-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Students Affected
                      </p>
                      <p className="text-2xl font-bold text-highlight-600">
                        {selectedDelay.affectedStudents}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button variant="primary" className="flex-1 w-full">
                  <AlertTriangle className="w-4 h-4" />
                  Report Issue
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDelay(null);
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
