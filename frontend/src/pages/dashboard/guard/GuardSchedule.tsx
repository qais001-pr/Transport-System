import { useContext } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Clock,
  Car,
  Users,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import userContext from "../../../context/userContext";

export default function GuardSchedule() {
  const { user, logOut }: any = useContext(userContext);
  const schedule = [
    {
      time: "7:00 AM - 7:15 AM",
      vans: [
        {
          vanNumber: "Van #G901",
          driver: "Lisa Anderson",
          students: 7,
          status: "scheduled",
        },
      ],
    },
    {
      time: "7:15 AM - 7:30 AM",
      vans: [
        {
          vanNumber: "Van #C789",
          driver: "Michael Brown",
          students: 8,
          status: "scheduled",
        },
      ],
    },
    {
      time: "7:30 AM - 7:45 AM",
      vans: [
        {
          vanNumber: "Van #A123",
          driver: "John Smith",
          students: 12,
          status: "arrived",
        },
      ],
    },
    {
      time: "7:45 AM - 8:00 AM",
      vans: [
        {
          vanNumber: "Van #B456",
          driver: "Sarah Williams",
          students: 10,
          status: "arrived",
        },
        {
          vanNumber: "Van #D012",
          driver: "Robert Lee",
          students: 14,
          status: "approaching",
        },
      ],
    },
    {
      time: "8:00 AM - 8:15 AM",
      vans: [
        {
          vanNumber: "Van #E345",
          driver: "Emily Davis",
          students: 9,
          status: "en-route",
        },
        {
          vanNumber: "Van #F678",
          driver: "David Wilson",
          students: 11,
          status: "en-route",
        },
        {
          vanNumber: "Van #H234",
          driver: "James Taylor",
          students: 13,
          status: "delayed",
        },
      ],
    },
  ];

  const stats = [
    {
      title: "Total Vans",
      value: "8",
      icon: Car,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
    {
      title: "Total Students",
      value: "96",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary-50",
    },
    {
      title: "Arrived",
      value: "3",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Delayed",
      value: "1",
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent-50",
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
          title="Daily Schedule"
          subtitle="Today's van arrival schedule"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-neutral-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Morning Schedule</CardTitle>
              <CardDescription>Van arrival timeline for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {schedule.map((slot, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-32 flex-shrink-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                        <Clock className="w-4 h-4" />
                        {slot.time}
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      {slot.vans.map((van, vanIndex) => (
                        <div
                          key={vanIndex}
                          className="p-4 bg-neutral-50 rounded-lg border-2 border-neutral-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Car className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-neutral-900">
                                  {van.vanNumber}
                                </p>
                                <p className="text-sm text-neutral-600">
                                  {van.driver} • {van.students} students
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                van.status === "arrived"
                                  ? "success"
                                  : van.status === "approaching"
                                    ? "warning"
                                    : van.status === "delayed"
                                      ? "danger"
                                      : "secondary"
                              }
                            >
                              {van.status.charAt(0).toUpperCase() +
                                van.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
