import { useMemo, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import * as XLSX from "xlsx";
//@ts-ignore
import { saveAs } from "file-saver";
import {
  Star,
  AlertTriangle,
  CheckCircle,
  Users,
  Download,
  Clock,
} from "lucide-react";
import { useContext } from "react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useSchoolReport from "../../../hooks/schools/get/useSchoolReport";

export default function SchoolDriverReports() {
  const [filterStatus, setFilterStatus] = useState("all");
  const { user, logOut }: any = useContext(userContext);

  const { data: driverReports, isLoading, error } = useSchoolReport();

  const driverPerformance = useMemo(() => {
    if (!driverReports) return [];
    return (
      driverReports?.map((d: any, index: number) => ({
        id: index + 1,
        name: d.full_name || "Unknown",
        rating: Number(d.average_rating || 0),
        complaints: Number(d.total_complaints || 0),
        performance: Number(d.performance_score || 0),
        trips: 0,
        safety: Number(d.performance_score || 0),
        punctuality: Number(d.performance_score || 0),
        cleanliness: Number(d.performance_score || 0),
        behavior: Number(d.performance_score || 0),
        status:
          d.verification_status === "APPROVED"
            ? "verified"
            : d.verification_status === "PENDING"
              ? "pending"
              : "rejected",
      })) || []
    );
  }, [driverReports]);

  const avgRating =
    driverPerformance.reduce((acc: any, d: any) => acc + d.rating, 0) /
    (driverPerformance.length || 1);

  const totalComplaints = driverPerformance.reduce(
    (acc: any, d: any) => acc + d.complaints,
    0,
  );

  const verifiedDrivers = driverPerformance.filter(
    (d: any) => d.status === "verified",
  ).length;

  const stats = [
    {
      title: "Average Rating",
      value: avgRating.toFixed(1),
      subtitle: "Out of 5",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Complaints",
      value: totalComplaints.toString(),
      subtitle: "All drivers",
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
    {
      title: "Verified Drivers",
      value: verifiedDrivers.toString(),
      subtitle: `Out of ${driverPerformance.length}`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Drivers",
      value: driverPerformance.length.toString(),
      subtitle: "In system",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
  ];

  const filteredDrivers = useMemo(() => {
    if (filterStatus === "all") return driverPerformance;
    return driverPerformance.filter((d: any) => d.status === filterStatus);
  }, [filterStatus, driverPerformance]);

  const exportToExcel = () => {
    if (!filteredDrivers || filteredDrivers.length === 0) return;

    const exportData = filteredDrivers.map((driver: any) => ({
      "Driver Name": driver.name,
      Rating: Number(driver.rating || 0).toFixed(1),
      "Performance Score (%)": driver.performance,
      "Total Complaints": driver.complaints,
      Status: driver.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Driver Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "driver_performance_report.xlsx");
  };

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
          title="Driver Performance Reports"
          subtitle="Track and analyze driver performance metrics"
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

          {/* Filter */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">All Drivers</option>
                    <option value="verified">Verified Only</option>
                    <option value="pending">Pending Only</option>
                  </select>
                </div>
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={exportToExcel}
                  disabled={!filteredDrivers || filteredDrivers.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Driver Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left px-3 sm:px-4 py-3 font-semibold text-neutral-700">
                        Driver
                      </th>
                      <th className="text-center px-3 sm:px-4 py-3 font-semibold text-neutral-700">
                        Rating
                      </th>
                      <th className="text-center px-3 sm:px-4 py-3 font-semibold text-neutral-700">
                        Score
                      </th>
                      <th className="text-center px-3 sm:px-4 py-3 font-semibold text-neutral-700">
                        Complaints
                      </th>
                      {/* <th className="text-center px-3 sm:px-4 py-3 font-semibold text-neutral-700">
                        Trips
                      </th> */}
                      <th className="text-center px-3 sm:px-4 py-3 font-semibold text-neutral-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  {isLoading && (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2 animate-spin" />
                      <p className="text-neutral-600">
                        Loading drivers reports...
                      </p>
                    </div>
                  )}
                  {error && (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="text-accent">
                        {error ||
                          "Failed to load drivers reports. Please try again."}
                      </p>
                    </div>
                  )}
                  <tbody>
                    {filteredDrivers?.length > 0
                      ? filteredDrivers.map((driver: any) => (
                          <tr
                            key={driver.id}
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                          >
                            <td className="px-3 sm:px-4 py-3">
                              <div>
                                <p className="font-medium text-neutral-900 text-xs sm:text-sm">
                                  {driver.name}
                                </p>
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-3 text-center">
                              <div className="inline-flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs font-semibold text-neutral-900">
                                  {Number(driver.rating || 0).toFixed(1)}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-3 text-center">
                              <span
                                className={`text-xs font-bold ${
                                  driver.performance >= 85
                                    ? "text-green-600"
                                    : driver.performance >= 70
                                      ? "text-yellow-600"
                                      : "text-accent"
                                }`}
                              >
                                {driver.performance}%
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-3 text-center">
                              <Badge
                                variant={
                                  driver.complaints === 0
                                    ? "success"
                                    : driver.complaints <= 2
                                      ? "warning"
                                      : "danger"
                                }
                                className="text-xs"
                              >
                                {driver.complaints}
                              </Badge>
                            </td>
                            {/* <td className="px-3 sm:px-4 py-3 text-center">
                          <span className="text-xs font-medium text-neutral-700">
                            {driver.trips}
                          </span>
                        </td> */}
                            <td className="px-3 sm:px-4 py-3 text-center">
                              <Badge
                                variant={
                                  driver.status === "verified"
                                    ? "success"
                                    : "warning"
                                }
                                className="text-xs"
                              >
                                {driver.status}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      : !isLoading &&
                        !error && (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-3 sm:px-4 py-3 text-center"
                            >
                              No drivers found.
                            </td>
                          </tr>
                        )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Metrics */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {filteredDrivers.map((driver:any) => (
              <Card key={driver.id}>
                <CardHeader>
                  <CardTitle className="text-base">{driver.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Safety", value: driver.safety },
                      { label: "Punctuality", value: driver.punctuality },
                      { label: "Cleanliness", value: driver.cleanliness },
                      { label: "Behavior", value: driver.behavior },
                    ].map((metric, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-neutral-700">
                            {metric.label}
                          </span>
                          <span className="text-xs font-bold text-neutral-900">
                            {metric.value}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={
                              metric.value >= 85
                                ? "bg-green-500"
                                : metric.value >= 70
                                  ? "bg-yellow-500"
                                  : "bg-accent"
                            }
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div> */}
        </main>
      </div>
    </div>
  );
}
