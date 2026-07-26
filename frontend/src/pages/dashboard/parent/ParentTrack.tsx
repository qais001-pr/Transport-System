import { useContext, useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Star,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import MapView from "../../../map/MapView";
//@ts-ignore
import { socket } from "../../../sockets/socket";
//@ts-ignore
import { getFileUrl } from "../../../api/apiConstant";

export default function ParentTrack() {
  const { user, logOut }: any = useContext(userContext);

  const [selectedChild, setSelectedChild] = useState(0);
  const [childData, setChildData] = useState<any[]>([]);
  const [location, setLocation] = useState({ lat: 33.5848, lng: 73.0658 });
  const [schoolLocation, setSchoolLocation] = useState({
    lat: 0,
    lng: 0,
    name: "",
  });

  const children = useMemo(() => {
    return childData.map((c) => ({
      id: c.id,
      name: c.full_name,
      vanId: c.van_id,
      vanNumber: `Van #${c?.van_number || "-"}`,
      driver: c?.driver_name || "-",
      driverPhone: c?.phone || "-",
      driverRating: Number(c?.average_rating || 0),
      totalReviews: Number(c?.total_reviews || 0),
      lat: c?.clat,
      lng: c?.clng,
      child_pic: c?.child_pic,
      schoolLat: c?.schoollat,
      schoolLng: c?.schoollng,
      branch_name: c?.branch_name,
      status: "on-route",
    }));
  }, [childData]);

  const child = useMemo(() => {
    return children[selectedChild] || null;
  }, [children, selectedChild]);

  const vanId = child?.vanId;

  useEffect(() => {
    socket.emit("child-on-route-details");

    const handler = (data: any) => {
      setChildData(data?.students || []);
    };

    socket.on("child-on-route-details", handler);
    return () => socket.off("child-on-route-details", handler);
  }, []);

  useEffect(() => {
    if (!vanId) return;

    socket.emit("join-parent", vanId);

    const handleLocation = (data: any) => {
      setLocation({ lat: data.lat, lng: data.lng });
    };

    socket.on("receive-location", handleLocation);
    return () => socket.off("receive-location", handleLocation);
  }, [vanId]);

  useEffect(() => {
    if (!child) return;

    setSchoolLocation({
      lat: child.schoolLat || 0,
      lng: child.schoolLng || 0,
      name: child.branch_name || "",
    });
  }, [child]);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "Guest"}
        userName={user?.full_name || "User"}
        userEmail={user?.email || "user@example.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header
          title={`${user?.role?.split(" ")[0] || "User"} Dashboard`}
          subtitle={`Welcome back, ${user?.full_name || "User"}`}
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Child Selector */}
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
            {children.map((c, index) => (
              <button
                key={c.id}
                onClick={() => setSelectedChild(index)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                  selectedChild === index
                    ? "border-primary bg-primary-50 shadow-card"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <Avatar
                  src={c.child_pic ? getFileUrl(c.child_pic) : undefined}
                  name={c.name}
                  size="sm"
                />
                <div className="text-left">
                  <p className="font-semibold text-neutral-900 text-sm">
                    {c.name}
                  </p>
                  <p className="text-xs text-neutral-600">{c.vanNumber}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="h-96 overflow-hidden">
                <MapView
                  latitude={location.lat}
                  longitude={location.lng}
                  schoolLocation={schoolLocation}
                  stops={
                    child
                      ? [
                          {
                            id: child.id,
                            lat: child.lat,
                            lng: child.lng,
                            student: child.name,
                            address: child.name,
                            order: 1,
                            status: child.status,
                          },
                        ]
                      : []
                  }
                  isNavigating={true}
                />
              </Card>
            </div>

            {/* Driver Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Driver Info</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex gap-3 mb-4">
                    <Avatar name={child?.driver} size="xl" />
                    <div>
                      <h4 className="font-semibold">{child?.driver}</h4>
                      <div className="flex items-center gap-1">
                        <Star
                          className={`w-4 h-4 ${
                            child?.driverRating >= 4
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                        <span>{child?.driverRating}</span>
                        <span className="text-xs text-neutral-500">
                          ({child?.totalReviews}) reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <MapPin className="w-4 h-4" />
                      {child?.vanNumber}
                    </div>
                    <div className="flex gap-2">
                      <Phone className="w-4 h-4" />
                      {child?.driverPhone}
                    </div>
                  </div>

                  {/* <div className="mt-4 space-y-2">
                    <Button className="w-full">
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </Button>
                  </div> */}
                </CardContent>
              </Card>

              {/* Notifications */}
              {/* <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Van departed</p>
                      <p className="text-xs">5 min ago</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-secondary-50 rounded-lg">
                    <Navigation className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium">On route</p>
                      <p className="text-xs">On schedule</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium">Approaching</p>
                      <p className="text-xs">ETA soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
