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
  Navigation,
  MapPin,
  Clock,
  Play,
  Square,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Compass,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import MapView from "../../../map/MapView";
//@ts-ignore
import { socket } from "../../../sockets/socket";
//@ts-ignore
import { getFileUrl } from "../../../api/apiConstant";
import { toast } from "react-toastify";
import axios from "axios";

export default function DriverTracking() {
  const [isNavigating, setIsNavigating] = useState(() => {
    return localStorage.getItem("isNavigating") === "true";
  });
  const { user, logOut }: any = useContext(userContext);
  const [schoolLocation, setSchoolLocation] = useState({
    lat: 0,
    lng: 0,
    name: "",
  });
  const [location, setLocation] = useState({
    lat: 33.5848,
    lng: 73.0658,
  });
  const [prevLocation, setPrevLocation] = useState<any>(null);
  const [prevTime, setPrevTime] = useState<any>(null);
  const [speed, setSpeed] = useState(0);

  const [showDelayModal, setShowDelayModal] = useState(false);

  const [delayForm, setDelayForm] = useState({
    reason: "",
    customReason: "",
    comments: "",
    delayMinutes: "",
  });

  const [vanStudents, setVanStudents] = useState<any[]>([]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km
  };

  const SAFE_SPEED = speed > 5 ? speed : 5;
  const ARRIVAL_RADIUS = 0.1; // km (~10m)

  const stops = [...vanStudents]
    .map((s: any) => {
      const distance = calculateDistance(
        location?.lat,
        location?.lng,
        s.latitude,
        s.longitude,
      );

      return {
        ...s,
        distance,
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .map((s: any, index: number) => {
      const etaMinutes = Math.round((s.distance / SAFE_SPEED) * 60) || 0;

      return {
        id: s.id,
        order: index + 1,
        student: s.full_name,
        address: s.pickup_address,
        lat: s.latitude,
        lng: s.longitude,
        childImage: s.child_pic,

        status:
          s.status === "PICKED"
            ? "completed"
            : index === 0
              ? "current" //
              : "upcoming",

        eta: etaMinutes ? `${etaMinutes} mins` : "Calculating...",
        isNear: s.distance < ARRIVAL_RADIUS,

        parent_name: s.parent_name,
        parent_phone: s.parent_phone,
        van_id: s.van_id,
        route_id: s.route_id,
        affectedStudents: s.total_students,
      };
    });

  // const updatedStops = stops.map((stop) => {
  //   const distance = calculateDistance(
  //     location.lat,
  //     location.lng,
  //     stop.lat,
  //     stop.lng
  //   );

  //   if (distance < ARRIVAL_RADIUS && stop.status !== "completed") {
  //     return { ...stop, status: "current" };
  //   }

  //   return stop;
  // });

  const routeData = {
    name: "Live Route",
    totalStops: stops.length,
    completedStops: stops.filter((s) => s.status === "completed").length,
    remainingStops: stops.filter((s) => s.status !== "completed").length,
    totalDistance: "-",
    coveredDistance: "-",
    estimatedArrival: "-",
    currentSpeed: `${speed} km/h`,
  };

  const enhancedStops = stops.map((stop) => {
    const distance = calculateDistance(
      location?.lat,
      location?.lng,
      stop?.lat,
      stop?.lng,
    );

    return {
      ...stop,
      isNear: distance < ARRIVAL_RADIUS,
    };
  });

  const currentStopData = enhancedStops.find((s) => s.status === "current");

  // Auto pickup trigger (optional but powerful)
  useEffect(() => {
    const current = stops.find((s) => s.status === "current");
    console.log("current....", current);

    if (!current) return;

    const distance = calculateDistance(
      location?.lat,
      location?.lng,
      current.lat || 0,
      current.lng || 0,
    );

    if (distance < 0.05) {
      console.log("Auto reached:", current.student);

      // 🔥 call API here
      // handlePickup(current.id)
    }
  }, [location, stops]);

  useEffect(() => {
    if (!user) return;

    socket.emit("join-van", { driverId: user.id });
  }, [user]);

  useEffect(() => {
    const handler = (data: any[]) => {
      console.log("all students in van", data);
      setVanStudents(data?.students || []);
      setSchoolLocation({
        lat: data?.school?.latitude,
        lng: data?.school?.longitude,
        name: data?.school?.name,
      });
    };

    socket.emit("all-students-in-van");
    socket.on("all-students-in-van", handler);

    return () => {
      socket.off("all-students-in-van", handler);
    };
  }, []);

  // JOIN DRIVER ROOM
  useEffect(() => {
    if (!user) return;

    socket.emit("join-driver");
    console.log("driver join", location);

    return () => {
      socket.off("connect");
    };
  }, [user]);

  // SEND LOCATION EVERY 5 SEC (SAFE)
  useEffect(() => {
    if (!isNavigating) return;

    const interval = setInterval(() => {
      console.log("ok", location);
      socket.emit("send-location", {
        lat: location?.lat,
        lng: location?.lng,
        speed: speed,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [location, isNavigating]);

  // use real GPS
  useEffect(() => {
    if (!isNavigating) return;

    const watchId = navigator.geolocation.watchPosition((pos) => {
      const newLat = pos.coords.latitude;
      const newLng = pos.coords.longitude;
      const currentTime = Date.now();

      if (prevLocation && prevTime) {
        const distance = calculateDistance(
          prevLocation.lat,
          prevLocation.lng,
          newLat,
          newLng,
        ); // in km

        if (distance < 0.01) return; // ignore tiny movement (<10 meters)

        const timeDiff = (currentTime - prevTime) / 1000 / 3600; // hours

        if (timeDiff > 0) {
          const currentSpeed = distance / timeDiff; // km/h
          setSpeed(Math.round(currentSpeed));
        }
      }

      setPrevLocation({ lat: newLat, lng: newLng });
      setPrevTime(currentTime);

      setLocation({
        lat: newLat,
        lng: newLng,
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isNavigating]);

  // delay data
  useEffect(() => {
    socket.on("new-delay", (data: any) => {
      console.log("Delay created:", data);
    });

    return () => {
      socket.off("new-delay");
    };
  }, []);

  const handleReportDelay = async () => {
    if (!delayForm.reason) return toast.error("Select reason");

    if (delayForm.reason === "Other" && !delayForm.customReason)
      return toast.error("Enter custom reason");

    if (!delayForm.delayMinutes) return toast.error("Enter delay minutes");

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`;
    const resp = await axios.get(url, {
      headers: {
        "User-Agent": "VanPoolingApp/1.0 (your-email@example.com)",
      },
    });

    const finalReason =
      delayForm.reason === "Other" ? delayForm.customReason : delayForm.reason;

    const delayData = {
      reason: finalReason,
      comments: delayForm.comments,
      delayMinutes: delayForm.delayMinutes,
      vanId: currentStopData?.van_id || null,
      routeId: currentStopData?.route_id || null,
      location: resp.data?.display_name || "",
      incidentDate: new Date(),
      studentsAffected: currentStopData?.affectedStudents || 0,
    };
    socket.emit("new-delay", delayData);
    console.log("delay data create....", delayData);
    setShowDelayModal(false);
    toast.success("Delay reported successfully");

    setDelayForm({
      reason: "",
      customReason: "",
      comments: "",
      delayMinutes: "",
    });
  };

  const delayReasons = [
    "Traffic Jam",
    "Vehicle Breakdown",
    "Weather Conditions",
    "Road Block",
    "Passenger Delay",
    "Accident",
    "Other",
  ];

  useEffect(() => {
    localStorage.setItem("isNavigating", isNavigating.toString());
  }, [isNavigating]);

  useEffect(() => {
    if (!currentStopData?.van_id) return;

    socket.emit("join-van-room", currentStopData.van_id);

    return () => {
      socket.emit("leave-van-room", currentStopData.van_id);
    };
  }, [currentStopData?.van_id]);

  const startNavigation = () => {
    socket.emit("route-status", {
      vanStatus: "on-route",
      vanId: currentStopData?.van_id || null,
    });
    setIsNavigating(true);
  };

  const stopNavigation = () => {
    socket.emit("route-status", {
      vanStatus: "stopped",
      vanId: currentStopData?.van_id || null,
    });
    setIsNavigating(false);
  };

  const handlePickup = () => {
    if (!currentStopData) {
      toast.error("No current stop found");
      return;
    }

    const distance = calculateDistance(
      location.lat,
      location.lng,
      currentStopData.lat,
      currentStopData.lng,
    );

    // 50 meters
    const PICKUP_RADIUS = 0.05;

    if (distance > PICKUP_RADIUS) {
      toast.error(
        `You are too far from pickup location (${(distance * 1000).toFixed(
          0,
        )}m away)`,
      );
      return;
    }

    socket.emit("picked-up-notification", {
      childId: currentStopData.id,
      vanId: currentStopData.van_id,
      pickup_time: new Date(),
      latitude: location.lat,
      longitude: location.lng,
    });

    setVanStudents((prev) =>
      prev.map((student) =>
        student.id === currentStopData.id
          ? { ...student, status: "PICKED" }
          : student,
      ),
    );

    toast.success(`${currentStopData.student} picked up successfully`);
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
          title="Live Navigation"
          subtitle="Real-time route tracking and navigation"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Status Banner */}
          <Card
            className={`mb-6 ${
              isNavigating
                ? "bg-gradient-to-br from-green-500 to-green-600"
                : "bg-gradient-to-br from-primary to-secondary"
            } text-white`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{routeData.name}</h2>
                    <Badge
                      variant={isNavigating ? "success" : "secondary"}
                      className="bg-white/20 text-white border-0"
                    >
                      <span
                        className={`status-dot ${
                          isNavigating ? "status-active" : "status-inactive"
                        } animate-pulse`}
                      />
                      {isNavigating ? "Navigating" : "Ready to Start"}
                    </Badge>
                  </div>
                  <p className="text-white/90">
                    Stop {routeData.completedStops + 1} of{" "}
                    {routeData.totalStops} •
                    {isNavigating
                      ? ` ${routeData.remainingStops} stops remaining`
                      : " Not started"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant={isNavigating ? "accent" : "secondary"}
                    size="lg"
                    onClick={isNavigating ? stopNavigation : startNavigation}
                    className="bg-white text-primary hover:bg-neutral-100"
                  >
                    {isNavigating ? (
                      <>
                        <Square className="w-5 h-5" />
                        End Route
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Start Navigation
                      </>
                    )}
                  </Button>
                  {isNavigating && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-white text-white hover:bg-white/10"
                      onClick={() => setShowDelayModal(true)}
                    >
                      <AlertTriangle className="w-5 h-5" />
                      Report Delay
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <div className="mb-6">
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowDelayModal(true)}
            >
              <Plus className="w-5 h-5" />
              Report New Delay
            </Button>
          </div> */}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map and Current Stop */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Map */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Live Map</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="success"
                        className="flex items-center gap-1"
                      >
                        <span className="status-dot status-active animate-pulse" />
                        Live
                      </Badge>
                      <Badge variant="secondary">
                        <Compass className="w-3 h-3" />
                        {routeData.currentSpeed}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Map Placeholder */}
                  <div className="relative w-full h-96 bg-neutral-100 rounded-xl overflow-hidden">
                    <div className="h-full w-full">
                      <MapView
                        latitude={location?.lat}
                        longitude={location?.lng}
                        stops={stops}
                        schoolLocation={schoolLocation}
                        isNavigating={isNavigating}
                      />
                    </div>

                    {/* Floating Stats */}
                    <div className="absolute top-4 left-4 right-4 grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg shadow-card p-3">
                        <p className="text-xs text-neutral-600">Distance</p>
                        <p className="text-sm font-bold text-neutral-900">
                          {routeData.coveredDistance} /{" "}
                          {routeData.totalDistance}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg shadow-card p-3">
                        <p className="text-xs text-neutral-600">ETA</p>
                        <p className="text-sm font-bold text-neutral-900">
                          {routeData.estimatedArrival}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg shadow-card p-3">
                        <p className="text-xs text-neutral-600">Speed</p>
                        <p className="text-sm font-bold text-neutral-900">
                          {routeData.currentSpeed}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Stop Details */}
              {currentStopData && isNavigating && (
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          Next Stop
                        </CardTitle>
                        <CardDescription>
                          Arriving in {currentStopData.eta}
                        </CardDescription>
                      </div>
                      <Badge variant="warning" className="text-lg px-4 py-2">
                        Stop {currentStopData.order}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar
                        src={getFileUrl(currentStopData.childImage)}
                        name={currentStopData.student}
                        size="xl"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-neutral-900 mb-1">
                          {currentStopData.student}
                        </h3>
                        <p className="text-neutral-600 mb-2">
                          {currentStopData.address}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Clock className="w-4 h-4" />
                            <span>Scheduled: {currentStopData.eta}</span>
                          </div>
                          <div className="flex items-center gap-2 text-primary font-semibold">
                            <Navigation className="w-4 h-4" />
                            <span>ETA: {currentStopData.eta}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary-50 rounded-lg mb-4">
                      <p className="text-sm font-medium text-neutral-900 mb-2">
                        Parent Contact
                      </p>
                      <p className="text-sm text-neutral-700">
                        {currentStopData.parent_name}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {currentStopData.parent_phone}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={handlePickup}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Picked Up
                      </Button>
                      {/* <Button variant="outline">
                        <Phone className="w-4 h-4" />
                        Call Parent
                      </Button> */}
                      {/* <Button variant="outline">
                        <MessageSquare className="w-4 h-4" />
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Route Progress */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Route Progress</CardTitle>
                  <CardDescription>
                    {routeData.completedStops} of {routeData.totalStops} stops
                    completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-neutral-600">Progress</span>
                      <span className="font-semibold text-neutral-900">
                        {Math.round(
                          (routeData.completedStops / routeData.totalStops) *
                            100,
                        ) || 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (routeData.completedStops / routeData.totalStops) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stops List */}
                  <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
                    {stops.map((stop) => (
                      <div
                        key={stop.id}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          stop.status === "current"
                            ? "border-primary bg-primary-50"
                            : stop.status === "completed"
                              ? "border-green-200 bg-green-50"
                              : "border-neutral-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              stop.status === "completed"
                                ? "bg-green-500 text-white"
                                : stop.status === "current"
                                  ? "bg-primary text-white"
                                  : "bg-neutral-200 text-neutral-600"
                            }`}
                          >
                            {stop.status === "completed" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              stop.order
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <p className="font-semibold text-neutral-900 text-sm">
                                {stop.student}
                              </p>
                              {stop.status === "completed" && (
                                <Badge variant="success" className="text-xs">
                                  Done
                                </Badge>
                              )}
                              {stop.status === "current" && (
                                <Badge variant="warning" className="text-xs">
                                  Current
                                </Badge>
                              )}
                              {currentStopData && currentStopData.isNear && (
                                <Badge variant="secondary">Nearby</Badge>
                              )}
                            </div>
                            <p className="text-xs text-neutral-600 mb-1">
                              {stop.address}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                              <Clock className="w-3 h-3" />
                              {stop.status === "completed" ? (
                                <span>Completed at {stop.eta}</span>
                              ) : stop.status === "current" ? (
                                <span className="text-primary font-semibold">
                                  ETA: {stop.eta}
                                </span>
                              ) : (
                                <span>{stop.eta}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Delay Report Modal */}
      {showDelayModal && (
        <div className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-bold">Report Delay</h2>

            <select
              className="w-full border p-2 rounded"
              value={delayForm.reason}
              onChange={(e) =>
                setDelayForm({ ...delayForm, reason: e.target.value })
              }
            >
              <option value="">Select Reason</option>
              {delayReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Show custom input ONLY if "Other" selected */}
            {delayForm.reason === "Other" && (
              <input
                placeholder="Enter custom reason"
                className="w-full border p-2 rounded"
                value={delayForm.customReason}
                onChange={(e) =>
                  setDelayForm({ ...delayForm, customReason: e.target.value })
                }
              />
            )}

            <textarea
              placeholder="Comments"
              className="w-full border p-2 rounded"
              value={delayForm.comments}
              onChange={(e) =>
                setDelayForm({ ...delayForm, comments: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Delay Minutes"
              className="w-full border p-2 rounded"
              value={delayForm.delayMinutes}
              onChange={(e) =>
                setDelayForm({ ...delayForm, delayMinutes: e.target.value })
              }
            />

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleReportDelay}>
                Submit
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDelayModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
