import  { useContext, useState } from "react";
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
  Calendar,
  Users,
  Car,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import userContext from "../../../context/userContext";

export default function GuardReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const { user, logOut }: any = useContext(userContext);

  const stats = [
    {
      title: "Total Arrivals",
      value: "480",
      change: "+12%",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
    {
      title: "On-Time Rate",
      value: "94%",
      change: "+2%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Delays",
      value: "8",
      change: "-3",
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
    {
      title: "Avg Time",
      value: "7:52 AM",
      change: "+2 mins",
      icon: Clock,
      color: "text-secondary",
      bgColor: "bg-secondary-50",
    },
  ];

  const dailyData = [
    {
      day: "Monday",
      vans: 8,
      students: 96,
      verified: 96,
      onTime: 7,
      delayed: 1,
      avgTime: "7:50 AM",
    },
    {
      day: "Tuesday",
      vans: 8,
      students: 96,
      verified: 96,
      onTime: 8,
      delayed: 0,
      avgTime: "7:48 AM",
    },
    {
      day: "Wednesday",
      vans: 8,
      students: 96,
      verified: 96,
      onTime: 7,
      delayed: 1,
      avgTime: "7:52 AM",
    },
    {
      day: "Thursday",
      vans: 8,
      students: 96,
      verified: 94,
      onTime: 6,
      delayed: 2,
      avgTime: "7:55 AM",
    },
    {
      day: "Friday",
      vans: 8,
      students: 96,
      verified: 96,
      onTime: 8,
      delayed: 0,
      avgTime: "7:47 AM",
    },
  ];

  const vanPerformance = [
    {
      vanNumber: "Van #A123",
      driver: "John Smith",
      arrivals: 5,
      onTime: 5,
      delayed: 0,
      avgTime: "7:46 AM",
      rating: 100,
    },
    {
      vanNumber: "Van #B456",
      driver: "Sarah Williams",
      arrivals: 5,
      onTime: 5,
      delayed: 0,
      avgTime: "7:50 AM",
      rating: 100,
    },
    {
      vanNumber: "Van #C789",
      driver: "Michael Brown",
      arrivals: 5,
      onTime: 5,
      delayed: 0,
      avgTime: "7:55 AM",
      rating: 100,
    },
    {
      vanNumber: "Van #D012",
      driver: "Robert Lee",
      arrivals: 5,
      onTime: 4,
      delayed: 1,
      avgTime: "8:02 AM",
      rating: 80,
    },
    {
      vanNumber: "Van #E345",
      driver: "Emily Davis",
      arrivals: 5,
      onTime: 5,
      delayed: 0,
      avgTime: "8:05 AM",
      rating: 100,
    },
    {
      vanNumber: "Van #F678",
      driver: "David Wilson",
      arrivals: 5,
      onTime: 5,
      delayed: 0,
      avgTime: "8:10 AM",
      rating: 100,
    },
    {
      vanNumber: "Van #G901",
      driver: "Lisa Anderson",
      arrivals: 5,
      onTime: 4,
      delayed: 1,
      avgTime: "8:18 AM",
      rating: 80,
    },
    {
      vanNumber: "Van #H234",
      driver: "James Taylor",
      arrivals: 5,
      onTime: 3,
      delayed: 2,
      avgTime: "8:12 AM",
      rating: 60,
    },
  ];

  const incidents = [
    {
      date: "2025-10-09",
      van: "Van #H234",
      type: "Delay",
      description: "Traffic jam on Main Street",
      severity: "medium",
    },
    {
      date: "2025-10-08",
      van: "Van #D012",
      type: "Delay",
      description: "Vehicle breakdown",
      severity: "high",
    },
    {
      date: "2025-10-07",
      van: "Van #G901",
      type: "Delay",
      description: "Bad weather conditions",
      severity: "low",
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
          title="Reports & Analytics"
          subtitle="View attendance and performance reports"
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
                    <Badge
                      variant={
                        stat.change.startsWith("+") ? "success" : "secondary"
                      }
                      className="text-xs"
                    >
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

          {/* Daily Overview */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daily Overview</CardTitle>
                  <CardDescription>
                    This week's attendance and performance
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedPeriod === "week" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={selectedPeriod === "month" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod("month")}
                  >
                    Month
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                        Day
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                        Vans
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                        Students
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                        Verified
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                        On-Time
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                        Delayed
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                        Avg Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.map((day, index) => (
                      <tr
                        key={index}
                        className="border-b border-neutral-100 hover:bg-neutral-50"
                      >
                        <td className="py-3 px-4 font-semibold text-neutral-900">
                          {day.day}
                        </td>
                        <td className="py-3 px-4 text-neutral-700">
                          {day.vans}
                        </td>
                        <td className="py-3 px-4 text-neutral-700">
                          {day.students}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              day.verified === day.students
                                ? "success"
                                : "warning"
                            }
                          >
                            {day.verified}/{day.students}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-green-600 font-semibold">
                          {day.onTime}
                        </td>
                        <td className="py-3 px-4 text-accent font-semibold">
                          {day.delayed}
                        </td>
                        <td className="py-3 px-4 text-neutral-700">
                          {day.avgTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Van Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Van Performance</CardTitle>
                <CardDescription>Weekly performance by van</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vanPerformance.map((van, index) => (
                    <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {van.vanNumber}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {van.driver}
                          </p>
                        </div>
                        <Badge
                          variant={
                            van.rating === 100
                              ? "success"
                              : van.rating >= 80
                                ? "warning"
                                : "danger"
                          }
                        >
                          {van.rating}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-600">On-Time</p>
                          <p className="font-semibold text-green-600">
                            {van.onTime}/{van.arrivals}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Delayed</p>
                          <p className="font-semibold text-accent">
                            {van.delayed}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Avg Time</p>
                          <p className="font-semibold text-neutral-900">
                            {van.avgTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Incidents */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>Delays and issues this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {incidents.map((incident, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        incident.severity === "high"
                          ? "border-accent bg-accent-50"
                          : incident.severity === "medium"
                            ? "border-highlight bg-highlight-50"
                            : "border-secondary bg-secondary-50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {incident.van}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {incident.date}
                          </p>
                        </div>
                        <Badge
                          variant={
                            incident.severity === "high"
                              ? "danger"
                              : incident.severity === "medium"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {incident.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-700">
                        {incident.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Download detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <FileText className="w-8 h-8 text-primary" />
                  <span className="font-semibold">Daily Report</span>
                  <span className="text-xs text-neutral-500">
                    Today's summary
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <Calendar className="w-8 h-8 text-secondary" />
                  <span className="font-semibold">Weekly Report</span>
                  <span className="text-xs text-neutral-500">This week</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <Users className="w-8 h-8 text-highlight" />
                  <span className="font-semibold">Attendance Report</span>
                  <span className="text-xs text-neutral-500">
                    Student records
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <Car className="w-8 h-8 text-accent" />
                  <span className="font-semibold">Van Report</span>
                  <span className="text-xs text-neutral-500">
                    Performance data
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
