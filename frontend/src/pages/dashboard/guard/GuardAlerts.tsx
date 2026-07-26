import { useContext, useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Car,
  Users,
  Eye,
  Trash2,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import { socket } from "../../../sockets/socket";

export default function GuardAlerts() {
  const [filterType, setFilterType] = useState("all");
  const { user, logOut }: any = useContext(userContext);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const mappedAlerts = alerts.map((d) => ({
    id: d.id,
    type: "delay",
    severity:
      d.delay_minutes > 15 ? "high" : d.delay_minutes > 5 ? "medium" : "low",

    title: `Van #${d.number_plate} Delayed`,
    message: `${d.reason} - ${d.comments || ""}`,

    van: `Van #${d.number_plate}`,
    driver: d.driver_name,

    time: new Date(d.reported_at).toLocaleString(),

    status: d.status === "PENDING" ? "active" : "resolved",

    affectedStudents: d.students_affected || 0,

    reason: d.reason,
    comments: d.comments,
    location: d.location,
    incidentDate: d.incident_date,
    delayMinutes: d.delay_minutes,
  }));

  const stats = [
    {
      title: "Total Alerts",
      value: mappedAlerts.length.toString(),
      subtitle: "Today",
      icon: Bell,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
    {
      title: "Critical",
      value: mappedAlerts
        .filter((a) => a.severity === "high")
        .length.toString(),
      subtitle: "Urgent",
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
    {
      title: "Resolved",
      value: mappedAlerts
        .filter((a) => a.status === "resolved")
        .length.toString(),
      subtitle: "Handled",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: mappedAlerts
        .filter((a) => a.status === "active")
        .length.toString(),
      subtitle: "Awaiting action",
      icon: Clock,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
    },
  ];

  const filteredAlerts =
    filterType === "all"
      ? mappedAlerts
      : mappedAlerts.filter((a) => a.status === filterType);

  useEffect(() => {
    const handler = (data: any[]) => {
      console.log("delays history", data);
      setAlerts(data);
    };

    socket.emit("delays-history");
    socket.on("delays-history", handler);

    return () => {
      socket.off("delays-history", handler);
    };
  }, []);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="danger">High</Badge>;
      case "medium":
        return <Badge variant="warning">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3" />
            Active
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3" />
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "delay":
        return <Clock className="w-5 h-5" />;
      case "missing":
        return <Users className="w-5 h-5" />;
      case "breakdown":
        return <Car className="w-5 h-5" />;
      case "weather":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
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
          title="Alerts & Notifications"
          subtitle="Monitor and manage system alerts"
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
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-neutral-600">{stat.title}</p>
                  <p className="text-xs text-neutral-500">{stat.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  All Alerts
                </Button>
                <Button
                  variant={filterType === "active" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("active")}
                >
                  <Clock className="w-4 h-4" />
                  Active
                </Button>
                <Button
                  variant={filterType === "resolved" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("resolved")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolved
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                hover
                className={`${
                  alert.severity === "high" && alert.status === "active"
                    ? "border-2 border-accent"
                    : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        alert.severity === "high"
                          ? "bg-accent-100 text-accent"
                          : alert.severity === "medium"
                            ? "bg-highlight-100 text-highlight"
                            : "bg-secondary-100 text-secondary"
                      }`}
                    >
                      {getAlertIcon(alert.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-neutral-900">
                              {alert.title}
                            </h3>
                            {getSeverityBadge(alert.severity)}
                            {getStatusBadge(alert.status)}
                          </div>
                          <p className="text-sm text-neutral-600">
                            {alert.time}
                          </p>
                        </div>
                      </div>

                      <p className="text-neutral-700 mb-4">{alert.message}</p>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                          <Car className="w-4 h-4 text-neutral-500" />
                          <div>
                            <p className="text-xs text-neutral-600">Van</p>
                            <p className="text-sm font-semibold text-neutral-900">
                              {alert.van}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                          <Users className="w-4 h-4 text-neutral-500" />
                          <div>
                            <p className="text-xs text-neutral-600">Driver</p>
                            <p className="text-sm font-semibold text-neutral-900">
                              {alert.driver}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-neutral-500" />
                          <div>
                            <p className="text-xs text-neutral-600">Affected</p>
                            <p className="text-sm font-semibold text-neutral-900">
                              {alert.affectedStudents} student
                              {alert.affectedStudents !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {alert.status === "active" && (
                          <Button variant="primary" size="sm">
                            <CheckCircle className="w-4 h-4" />
                            Mark as Resolved
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAlert(alert);
                            setShowModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent hover:bg-accent-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No alerts found
                </h3>
                <p className="text-neutral-600">
                  {filterType === "all"
                    ? "No alerts to display"
                    : `No ${filterType} alerts at this time`}
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Alert Details Modal */}
      {showModal && selectedAlert && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-neutral-900">
              Delay Details
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Van:</strong> {selectedAlert.van}
              </p>
              <p>
                <strong>Driver:</strong> {selectedAlert.driver}
              </p>
              <p>
                <strong>Reason:</strong> {selectedAlert.reason}
              </p>
              <p>
                <strong>Comments:</strong> {selectedAlert.comments || "N/A"}
              </p>
              <p>
                <strong>Delay:</strong> {selectedAlert.delayMinutes} minutes
              </p>
              <p>
                <strong>Location:</strong> {selectedAlert.location}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedAlert.incidentDate).toLocaleString()}
              </p>
              <p>
                <strong>Students Affected:</strong>{" "}
                {selectedAlert.affectedStudents}
              </p>
              <p>
                <strong>Status:</strong> {selectedAlert.status}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
