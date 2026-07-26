import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import * as XLSX from "xlsx";
//@ts-ignore
import { saveAs } from "file-saver";
import {
  Download,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useContext } from "react";
//@ts-ignore
import userContext from "../../../context/userContext";
// @ts-ignore
import useReport from "../../../hooks/police/get/useReport";

export default function SHOReports() {
  // const [reportType, setReportType] = useState("monthly");
  // const [dateRange, setDateRange] = useState("2026-02");
  const { user, logOut }: any = useContext(userContext);

  // Fetch report data from API
  const {
    data: reportData,
    isLoading: reportLoading,
    error: reportError,
  } = useReport();

  // Calculate totals from API data
  const totalVerified = parseInt(reportData?.total_verified_drivers || "0", 10);
  const totalRejected = parseInt(reportData?.total_rejected_drivers || "0", 10);
  const totalPending = parseInt(reportData?.total_pending_drivers || "0", 10);
  const totalApplications = totalVerified + totalRejected + totalPending;
  const verifiedPercentage =
    totalApplications > 0
      ? ((totalVerified / totalApplications) * 100).toFixed(0)
      : "0";
  const rejectedPercentage =
    totalApplications > 0
      ? ((totalRejected / totalApplications) * 100).toFixed(0)
      : "0";
  const pendingPercentage =
    totalApplications > 0
      ? ((totalPending / totalApplications) * 100).toFixed(0)
      : "0";

  // Transform API data into stats format
  const stats = reportData
    ? [
        {
          title: "Total Applications",
          value: totalApplications.toString(),
          change: "+0%",
          icon: FileText,
          color: "text-primary",
          bgColor: "bg-primary-50",
        },
        {
          title: "Verified Drivers",
          value: totalVerified.toString(),
          percentage: `${verifiedPercentage}%`,
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Documents Pending",
          value: totalPending.toString(),
          percentage: `${pendingPercentage}%`,
          icon: Clock,
          color: "text-highlight",
          bgColor: "bg-highlight-50",
        },
        {
          title: "Rejected Drivers",
          value: totalRejected.toString(),
          percentage: `${rejectedPercentage}%`,
          icon: AlertTriangle,
          color: "text-accent",
          bgColor: "bg-accent-50",
        },
      ]
    : [];

  // Transform API monthly data
  // const monthlyData =
  //   reportData?.monthly_trend && Array.isArray(reportData.monthly_trend)
  //     ? reportData.monthly_trend.map((month: any) => ({
  //         month: month.month_name || month.month || "Unknown",
  //         applications: month.total_applications || 0,
  //         approved: month.approved_count || 0,
  //         rejected: month.rejected_count || 0,
  //       }))
  //     : [];

  // Transform API verification status
  // const verificationStatus =
  //   reportData?.verification_status &&
  //   Array.isArray(reportData.verification_status)
  //     ? reportData.verification_status.map((status: any) => ({
  //         status: status.status_name || status.status || "Unknown",
  //         count: status.count || 0,
  //         percentage: status.percentage || 0,
  //       }))
  //     : [];

  // Transform API document stats - flatten individual document fields
  const documentStats = reportData
    ? [
        {
          document: "Driver License",
          verified: parseInt(reportData.total_verified_drivers || "0", 10),
          total: totalApplications,
          percentage:
            totalApplications > 0
              ? (
                  (parseInt(reportData.total_verified_drivers || "0", 10) /
                    totalApplications) *
                  100
                ).toFixed(0)
              : "0",
        },
        {
          document: "CNIC (ID Card)",
          verified: parseInt(reportData.total_verified_drivers || "0", 10),
          total: totalApplications,
          percentage:
            totalApplications > 0
              ? (
                  (parseInt(reportData.total_verified_drivers || "0", 10) /
                    totalApplications) *
                  100
                ).toFixed(0)
              : "0",
        },
        {
          document: "Vehicle Registration",
          verified: parseInt(reportData.total_verified_drivers || "0", 10),
          total: totalApplications,
          percentage:
            totalApplications > 0
              ? (
                  (parseInt(reportData.total_verified_drivers || "0", 10) /
                    totalApplications) *
                  100
                ).toFixed(0)
              : "0",
        },
        {
          document: "Vehicle Documents",
          verified: parseInt(reportData.total_verified_drivers || "0", 10),
          total: totalApplications,
          percentage:
            totalApplications > 0
              ? (
                  (parseInt(reportData.total_verified_drivers || "0", 10) /
                    totalApplications) *
                  100
                ).toFixed(0)
              : "0",
        },
        {
          document: "Vehicle Photo",
          verified: parseInt(reportData.total_verified_drivers || "0", 10),
          total: totalApplications,
          percentage:
            totalApplications > 0
              ? (
                  (parseInt(reportData.total_verified_drivers || "0", 10) /
                    totalApplications) *
                  100
                ).toFixed(0)
              : "0",
        },
      ]
    : [];

  // Transform API violations data
  // const topViolations =
  //   reportData?.top_violations && Array.isArray(reportData.top_violations)
  //     ? reportData.top_violations.map((violation: any) => ({
  //         type: violation.violation_type || violation.type || "Unknown",
  //         count: violation.count || 0,
  //         percentage: violation.percentage || 0,
  //       }))
  //     : [];

  const exportToExcel = () => {
    if (!documentStats || documentStats.length === 0) return;

    const exportData = documentStats.map((doc: any) => ({
      "Document Type": doc.document,
      "Total Verified": Number(doc.verified || 0).toFixed(1),
      "Rate Score (%)": doc.percentage,
      "Total Documents": doc.total,
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

    saveAs(data, "driver_documents_report.xlsx");
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
          title="Reports & Analytics"
          subtitle="Driver verification statistics and performance metrics"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-4 sm:p-6">
          {/* Loading and Error States */}
          {reportLoading && (
            <div className="text-center py-12">
              <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-3 animate-spin" />
              <p className="text-neutral-600">Loading report data...</p>
            </div>
          )}
          {reportError && (
            <div className="text-center py-12">
              <AlertTriangle className="w-8 h-8 text-accent mx-auto mb-3" />
              <p className="text-accent">Failed to load report data</p>
            </div>
          )}
          {!reportLoading && !reportError && (
            <>
              {/* Report Controls */}
              {/* <Card className="mb-6">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  >
                    <option value="monthly">Monthly Report</option>
                    <option value="quarterly">Quarterly Report</option>
                    <option value="annual">Annual Report</option>
                  </select>
                </div>
                    <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date Range
                  </label>
                  <input
                    type="month"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>
                    <div className="flex items-end gap-2">
                      <Button
                        variant="primary"
                        className="flex-1 sm:flex-none"
                        onClick={exportToExcel}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Key Metrics */}
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
                      {stat.change && (
                        <p className="text-xs text-green-600 font-medium">
                          {stat.change}
                        </p>
                      )}
                      {stat.percentage && (
                        <p className="text-xs text-neutral-500">
                          {stat.percentage}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts and Data */}
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"> */}
              {/* Monthly Trend */}
              {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-neutral-700">
                          {data.month}
                        </span>
                        <span className="text-sm font-bold text-neutral-900">
                          {data.applications} apps
                        </span>
                      </div>
                      <div className="flex gap-2 h-8 rounded-lg overflow-hidden bg-neutral-100">
                        <div
                          className="bg-green-500 flex items-center justify-center text-xs text-white font-semibold"
                          style={{
                            width: `${(data.approved / data.applications) * 100}%`,
                          }}
                        >
                          {data.approved > 0 && `${data.approved}`}
                        </div>
                        <div
                          className="bg-accent flex items-center justify-center text-xs text-white font-semibold"
                          style={{
                            width: `${(data.rejected / data.applications) * 100}%`,
                          }}
                        >
                          {data.rejected > 0 && `${data.rejected}`}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-neutral-600 mt-1">
                        <span>✓ {data.approved} approved</span>
                        <span>✕ {data.rejected} rejected</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

              {/* Verification Status */}
              {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationStatus.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-neutral-700">
                          {item.status}
                        </span>
                        <Badge
                          variant={idx === 0 ? "success" : "secondary"}
                          className="text-xs"
                        >
                          {item.count}
                        </Badge>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={
                            idx === 0
                              ? "bg-green-500"
                              : idx === 1
                                ? "bg-primary"
                                : "bg-accent"
                          }
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {item.percentage}% of total
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
              {/* </div> */}

              {/* Document Verification Rates */}
              <div className="flex items-end justify-end gap-2 mb-2">
                <Button
                  variant="primary"
                  className="flex-1 sm:flex-none"
                  onClick={exportToExcel}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Document Verification Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left px-4 py-2 font-semibold text-neutral-700">
                            Document Type
                          </th>
                          <th className="text-right px-4 py-2 font-semibold text-neutral-700">
                            Verified
                          </th>
                          <th className="text-right px-4 py-2 font-semibold text-neutral-700">
                            Total
                          </th>
                          <th className="text-right px-4 py-2 font-semibold text-neutral-700">
                            Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {documentStats.map((doc: any, idx: any) => (
                          <tr
                            key={idx}
                            className="border-b border-neutral-100 hover:bg-neutral-50"
                          >
                            <td className="px-4 py-3 text-neutral-900 font-medium">
                              {doc.document}
                            </td>
                            <td className="px-4 py-3 text-right text-neutral-700">
                              {doc.verified}
                            </td>
                            <td className="px-4 py-3 text-right text-neutral-700">
                              {doc.total}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Badge
                                variant="success"
                                className="text-xs justify-center w-16"
                              >
                                {doc.percentage}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Top Violations */}
              {/* <Card>
            <CardHeader>
              <CardTitle>Top Violation Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topViolations.map((violation, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-neutral-700">
                        {violation.type}
                      </span>
                      <span className="text-sm font-bold text-neutral-900">
                        {violation.count} cases
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={
                          idx === 0
                            ? "bg-accent"
                            : idx === 1
                              ? "bg-highlight"
                              : idx === 2
                                ? "bg-secondary"
                                : "bg-primary"
                        }
                        style={{ width: `${violation.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {violation.percentage}% of violations
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
