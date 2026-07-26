import { useContext, useEffect, useState } from "react";
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
  TrendingUp,
  Bus,
  Star,
  Calendar,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import { usePush } from "../../../push_notifications/subscribe";
//@ts-ignore
import { socket } from "../../../sockets/socket";
//@ts-ignore
import { getFileUrl } from "../../../api/apiConstant";
// import { useChildren } from "../../../hooks/parents/get/useChildren";

export default function ParentDashboard() {
  const { user, logOut }: any = useContext(userContext);
  const [childData, setChildData] = useState<any[]>([]);
  const [routeStatuses, setRouteStatuses] = useState<any>({});

  usePush(user?.id);

  const stats = [
    {
      title: "Active Children",
      value: childData.length || 0,
      change: "+0%",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary-50",
    },
    {
      title: "Active Bookings",
      value: "2",
      change: "+0%",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
    {
      title: "Monthly Cost",
      value: "Rs. 5000",
      change: "+0%",
      icon: DollarSign,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
    },
    {
      title: "On-Time Rate",
      value: "98%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const children = childData.map((c) => ({
    id: c.id,
    name: c.full_name,
    vanId: c.van_id,
    vanNumber: `Van #${c?.van_number || "-"}`,
    driver: c?.driver_name || "-",
    driverPhone: c?.phone || "-",
    driverRating: Number(c?.average_rating || 0),
    eta: "Calculating...",
    distance: "-",
    status: routeStatuses[c.van_id] || "upcoming",
    stops: [
      {
        lat: c?.clat,
        lng: c?.clng,
      },
    ],
    totalReviews: Number(c?.total_reviews || 0),
    lat: c?.clat,
    lng: c?.clng,
    age: c?.age,
    branch_name: c?.branch_name,
    child_pic: c.child_pic,
  }));

  useEffect(() => {
    socket.emit("child-on-route-details");

    const handler = (data: any[]) => {
      console.log("parent child data...", data);
      setChildData(data?.students || []);
    };

    socket.on("child-on-route-details", handler);

    return () => socket.off("child-on-route-details", handler);
  }, []);

  // join van rooms dynamically
  useEffect(() => {
    if (!childData?.length) return;

    const vanIds = childData.map((item: any) => item.van_id).filter(Boolean);

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
  }, [childData]);

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

  // const recentActivity = [
  //   {
  //     id: 1,
  //     type: "pickup",
  //     message: "Ali Hassan ko safely pick kar liya gaya",
  //     time: "7:45 AM",
  //     status: "success",
  //   },
  //   {
  //     id: 2,
  //     type: "dropoff",
  //     message: "Ayesha Khan school drop ho gayi",
  //     time: "8:15 AM",
  //     status: "success",
  //   },
  //   {
  //     id: 3,
  //     type: "payment",
  //     message: "Mahana fee successfully receive ho gayi",
  //     time: "Kal",
  //     status: "success",
  //   },
  //   {
  //     id: 4,
  //     type: "alert",
  //     message: "Van 5 minutes late hai - Traffic jam Murree Road",
  //     time: "2 din pehle",
  //     status: "warning",
  //   },
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
          title="Parent Dashboard"
          subtitle={`Welcome back, ${
            user?.full_name || "Zaman Ali"
          }! Here's what's happening today.`}
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Stats Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          </div> */}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Children Status */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Children Status</CardTitle>
                      <CardDescription>
                        Real-time tracking of your children
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        (window.location.href = "/dashboard/parent/track")
                      }
                    >
                      <MapPin className="w-4 h-4" />
                      Track All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {/* <Avatar name={child.name} size="lg" /> */}
                            <Avatar
                              src={getFileUrl(child.child_pic)}
                              name={child.name}
                              size="lg"
                            />
                            <div>
                              <h4 className="font-semibold text-neutral-900">
                                {child.name}
                              </h4>
                              <p className="text-sm text-neutral-600">
                                Age {child.age} • {child.branch_name}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              child.status === "on-route"
                                ? "success"
                                : "danger"
                            }
                            className="flex items-center gap-1"
                          >
                            <span
                              className={`status-dot ${
                                child.status === "on-route"
                                  ? "status-active"
                                  : "status-danger"
                              }`}
                            />
                            {child.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Bus className="w-4 h-4 text-neutral-500" />
                            <span className="text-neutral-700">
                              {child.vanNumber}
                            </span>
                          </div>
                          {/* <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-neutral-500" />
                            <span className="text-neutral-700">
                              ETA: {child.eta}
                            </span>
                          </div> */}
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-neutral-500" />
                            <span className="text-neutral-700">
                              {child.driver}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="w-4 h-4 text-highlight fill-highlight" />
                            <span className="text-neutral-700">
                              {child.driverRating}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              (window.location.href = "/dashboard/parent/track")
                            }
                          >
                            <MapPin className="w-4 h-4" />
                            Track Live
                          </Button>
                          {/* <Button variant="outline" size="sm">
                            View Details
                          </Button> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            {/* <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            activity.status === "success"
                              ? "bg-green-100"
                              : activity.status === "warning"
                                ? "bg-highlight-100"
                                : "bg-accent-100"
                          }`}
                        >
                          {activity.status === "success" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-highlight-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-neutral-900 font-medium">
                            {activity.message}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    View All Activity
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4" />
                      Add New Child
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bus className="w-4 h-4" />
                      Find New Van
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4" />
                      Make Payment
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="w-4 h-4" />
                      Rate Driver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}
