import { useContext, useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Car,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Eye,
  Navigation,
  UserCheck,
  Search,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import { socket } from "../../../sockets/socket";
//@ts-ignore
import { getFileUrl } from "../../../api/apiConstant";
// @ts-ignore
import useUpdateStudent from "../../../hooks/guard/put/useUpdateStudent";
import axios from "axios";
import { toast } from "react-toastify";

export default function GuardVans() {
  const { user, logOut }: any = useContext(userContext);
  const [vansData, setVansData] = useState<any[]>([]);
  const [locations, setLocations] = useState<any>({});
  const [selectedVan, setSelectedVan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingStudentId, setLoadingStudentId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<any>({});

  const { mutate: updateStudent } = useUpdateStudent();

  const getLocationNameByCoordinates = async (lat: number, lng: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      const resp = await axios.get(url, {
        headers: { "User-Agent": "VanPoolingApp/1.0 (http://localhost:3000)" },
      });
      return resp.data?.display_name;
    } catch (err) {
      console.error(err);
      toast.error("Error searching address");
    }
  };

  const calculateETA = (distanceInMeters: number) => {
    if (!distanceInMeters) return "-";

    const speedKmPerHour = 40; // adjust if needed
    const distanceKm = distanceInMeters / 1000;

    const timeHours = distanceKm / speedKmPerHour;
    const timeMinutes = Math.round(timeHours * 60);

    if (timeMinutes <= 1) return "Arriving";
    if (timeMinutes < 60) return `${timeMinutes} min`;

    const hours = Math.floor(timeMinutes / 60);
    const mins = timeMinutes % 60;

    return `${hours}h ${mins}m`;
  };

  const calculateETAMinutes = (distanceInMeters: number) => {
    if (!distanceInMeters) return 0;

    const speedKmPerHour = 40;
    const distanceKm = distanceInMeters / 1000;

    const timeHours = distanceKm / speedKmPerHour;
    return Math.round(timeHours * 60); // minutes
  };

  const normalizedVans = vansData.map((v: any, index: number) => {
    const [verified, total] = (v.students || "0/0").split("/").map(Number);
    const key = `${v.lat},${v.lng}`;

    const minutes = calculateETAMinutes(Number(v.distance));
    const expectedTime =
      v.status === "arrived"
        ? "Arrived"
        : minutes > 0
          ? new Date(Date.now() + minutes * 60000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-";

    return {
      id: index,
      vanNumber: v.vanNumber,
      driver: v.driver,
      driverPhone: v.phone,
      driver_profile_photo: v.driver_profile_photo,
      status: v.status, // "on-route"
      students: total || 0,
      childPics: v.child_data?.child_pics || [],
      childNames: v.child_data?.child_names || [],
      childIds: v.child_data?.child_ids || [],
      schoolId: v?.school_id || null,
      latitude: v.lat,
      longitude: v.lng,
      vanId: v.vanId,
      verified: verified || 0,
      eta:
        v.status === "arrived" ? "Arrived" : calculateETA(Number(v.distance)),
      location: locations[key] || `${v.lat}, ${v.lng}`,
      // location: `${v.lat}, ${v.lng}`,
      expectedTime: expectedTime,
      actualTime: v.lastUpdate,
      route: v.branch_name || "-",
      distance: v.distance || 0,
    };
  });

  console.log(selectedVan);

  const filteredVans = normalizedVans.filter((v) => {
    const query = searchQuery.toLowerCase();
    return (
      v.vanNumber.toLowerCase().includes(query) ||
      v.route.toLowerCase().includes(query)
    );
  });

  const handleVerifyStudent = (student: any, status: "VERIFIED" | "ABSENT") => {
    const studentId = student.studentId;

    console.log(student);

    if (!studentId) {
      toast.error("Student ID missing");
      return;
    }

    setLoadingStudentId(studentId);

    updateStudent(
      {
        payload: {
          child_ids: [studentId],
          van_id: student.vanId,
          school_id: student.schoolId,
          verification_type: status,
          latitude: student.latitude,
          longitude: student.longitude,
          remarks: `Student marked ${status} by guard`,
          verification_time: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          setAttendance((prev: any) => ({
            ...prev,
            [studentId]: status,
          }));

          socket.emit("new-notification");

          toast.success(`Student marked ${status}`);
        },

        onError: (error: any) => {
          console.error(error);

          toast.error(
            error?.response?.data?.message || "Failed to update attendance",
          );
        },

        onSettled: () => {
          setLoadingStudentId(null);
        },
      },
    );
  };

  useEffect(() => {
    socket.emit("get-vans-status");

    socket.on("vans-status", (data: any) => {
      console.log("data guard vans", data);
      setVansData(data);
    });

    return () => socket.off("vans-status");
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const newLocations: any = {};

      for (const v of vansData) {
        const key = `${v.lat},${v.lng}`;

        if (!newLocations[key]) {
          const name = await getLocationNameByCoordinates(v.lat, v.lng);
          newLocations[key] = name || key;
        }
      }

      setLocations(newLocations);
    };

    if (vansData.length) fetchLocations();
  }, [vansData]);

  const stats = [
    {
      title: "Expected Vans",
      value: vansData?.length || 0,
      subtitle: "Today",
      icon: Car,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
    {
      title: "Arrived",
      value: vansData?.filter((v) => v.status === "arrived").length || 0,
      subtitle: "On campus",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "En Route",
      value: vansData?.filter((v) => v.status === "on-route").length || 0,
      subtitle: "Approaching",
      icon: Navigation,
      color: "text-secondary",
      bgColor: "bg-secondary-50",
    },
    {
      title: "Delayed",
      value: vansData?.filter((v) => v.status === "delayed").length || 0,
      subtitle: "Running late",
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "arrived":
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3" />
            Arrived
          </Badge>
        );
      case "approaching":
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3" />
            Approaching
          </Badge>
        );
      case "on-route":
        return (
          <Badge variant="secondary">
            <Navigation className="w-3 h-3" />
            En Route
          </Badge>
        );
      case "delayed":
        return (
          <Badge variant="danger">
            <AlertTriangle className="w-3 h-3" />
            Delayed
          </Badge>
        );
      default:
        return null;
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
          title="Van Monitoring"
          subtitle="Track incoming vans and student arrivals"
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

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by van number or school name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vans List */}
          <div className="space-y-4">
            {filteredVans.length > 0 ? (
              filteredVans.map((van: any) => (
                <Card
                  key={van.id}
                  hover
                  className={
                    van.status === "delayed" ? "border-2 border-accent" : ""
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-neutral-900">
                                {van.vanNumber}
                              </h3>
                              {getStatusBadge(van.status)}
                            </div>
                            <p className="text-sm text-neutral-600">
                              {van.route}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-neutral-600">Expected</p>
                            <p className="text-lg font-bold text-neutral-900">
                              {van.expectedTime}
                            </p>
                            {van.actualTime && (
                              <p className="text-xs text-green-600">
                                Arrived: {van.actualTime}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Van Details Grid */}
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div className="p-3 bg-neutral-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-neutral-500" />
                              <span className="text-xs text-neutral-600">
                                Students
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-neutral-900">
                              {van.verified}/{van.students}
                            </p>
                            {van.status === "arrived" && (
                              <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-2">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    van.verified === van.students
                                      ? "bg-green-500"
                                      : "bg-primary"
                                  }`}
                                  style={{
                                    width: `${
                                      van.students
                                        ? (van.verified / van.students) * 100
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="p-3 bg-neutral-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-neutral-500" />
                              <span className="text-xs text-neutral-600">
                                ETA
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-neutral-900">
                              {van.eta}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {van.distance
                                ? `${(van.distance / 1000).toFixed(1)} km away`
                                : ""}
                            </p>
                          </div>

                          <div className="p-3 bg-neutral-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-neutral-500" />
                              <span className="text-xs text-neutral-600">
                                Location
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-neutral-900">
                              {van.location}
                            </p>
                          </div>

                          <div className="p-3 bg-neutral-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <UserCheck className="w-4 h-4 text-neutral-500" />
                              <span className="text-xs text-neutral-600">
                                Driver
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-neutral-900">
                              {van.driver}
                            </p>
                          </div>
                        </div>

                        {/* Driver Contact */}
                        <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                          <Avatar
                            src={getFileUrl(van?.driver_profile_photo)}
                            name={van.driver}
                            size="md"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-neutral-900">
                              {van.driver}
                            </p>
                            <p className="text-xs text-neutral-600">
                              {van.driverPhone}
                            </p>
                          </div>
                          {/* <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                          Call
                        </Button> */}
                        </div>

                        {/* Delay Alert */}
                        {van.status === "delayed" && van.delayReason && (
                          <div className="mt-4 p-3 bg-accent-50 rounded-lg border border-accent-200">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-neutral-900">
                                  Delay Reported
                                </p>
                                <p className="text-sm text-neutral-700">
                                  {van.delayReason}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Section - Actions */}
                      <div className="lg:w-48 flex flex-col gap-2">
                        {van.status === "arrived" &&
                          van.verified < van.students && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-full"
                            >
                              <UserCheck className="w-4 h-4" />
                              Verify Students
                            </Button>
                          )}

                        {van.status === "arrived" &&
                          van.verified === van.students && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Complete
                            </Button>
                          )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedVan(van);
                            setIsModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>

                        {/* <Button variant="outline" size="sm" className="w-full">
                        <MapPin className="w-4 h-4" />
                        Track Location
                      </Button> */}

                        {van.status === "approaching" && (
                          <Badge
                            variant="warning"
                            className="w-full justify-center py-2"
                          >
                            <Clock className="w-3 h-3" />
                            Arriving Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-sm text-neutral-500">
                No vans found matching your search.
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && selectedVan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 sm:px-6 py-4">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 break-words">
                  {selectedVan.vanNumber}
                </h2>

                <p className="text-sm text-neutral-500">
                  Student Verification Details
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              {/* Van Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">Driver</p>
                  <p className="font-semibold text-neutral-900 break-words">
                    {selectedVan.driver}
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">Students</p>
                  <p className="font-semibold text-neutral-900">
                    {selectedVan.verified}/{selectedVan.students}
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">ETA</p>
                  <p className="font-semibold text-neutral-900">
                    {selectedVan.eta}
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">Status</p>
                  <p className="font-semibold capitalize text-neutral-900">
                    {selectedVan.status}
                  </p>
                </div>
              </div>

              {/* Students Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-neutral-900">
                    Students List
                  </h3>

                  <Badge variant="secondary">
                    {selectedVan.childNames?.length || 0} Students
                  </Badge>
                </div>

                {selectedVan.childNames?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {selectedVan.childNames.map(
                      (studentName: string, index: number) => {
                        const studentId = selectedVan.childIds?.[index];

                        const status = attendance[studentId];

                        return (
                          <div
                            key={index}
                            className="border rounded-2xl p-4 hover:shadow-md transition-all duration-200"
                          >
                            {/* Student Info */}
                            <div className="flex items-center gap-3 mb-4">
                              <Avatar
                                src={getFileUrl(selectedVan.childPics?.[index])}
                                name={studentName}
                                size="lg"
                              />

                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-neutral-900 break-words">
                                  {studentName}
                                </h4>

                                <p className="text-xs text-neutral-500">
                                  Student #{index + 1}
                                </p>
                              </div>
                            </div>

                            {/* Status */}
                            {status && (
                              <div
                                className={`mb-3 rounded-lg px-3 py-2 text-sm font-medium text-center ${
                                  status === "VERIFIED"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                              >
                                {status === "VERIFIED" ? "VERIFIED" : "ABSENT"}
                              </div>
                            )}

                            {/* Buttons */}
                            <div
                              className={`grid grid-cols-${status === "VERIFIED" || status === "ABSENT" ? 1 : 2} gap-2`}
                            >
                              {status === "VERIFIED" || status === "ABSENT" ? (
                                <Button variant="outline" className="w-full">
                                  <CheckCircle className="w-4 h-4" />
                                  Marked Attendance
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant={
                                      status === "VERIFIED"
                                        ? "primary"
                                        : "outline"
                                    }
                                    className={`w-full ${
                                      status === "VERIFIED"
                                        ? "!bg-green-600 !border-green-600 hover:!bg-green-700"
                                        : ""
                                    }`}
                                    disabled={loadingStudentId === studentId}
                                    onClick={() =>
                                      handleVerifyStudent(
                                        {
                                          studentId:
                                            selectedVan.childIds?.[index],

                                          schoolId: selectedVan.schoolId,

                                          vanId: selectedVan.vanId,

                                          latitude: selectedVan.latitude,

                                          longitude: selectedVan.longitude,
                                        },
                                        "VERIFIED",
                                      )
                                    }
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {loadingStudentId === studentId
                                      ? "Saving..."
                                      : "Present"}
                                  </Button>

                                  <Button
                                    variant={
                                      status === "ABSENT"
                                        ? "primary"
                                        : "outline"
                                    }
                                    className={`w-full ${
                                      status === "ABSENT"
                                        ? "!bg-red-600 !border-red-600 hover:!bg-red-700"
                                        : ""
                                    }`}
                                    disabled={loadingStudentId === studentId}
                                    onClick={() =>
                                      handleVerifyStudent(
                                        {
                                          studentId:
                                            selectedVan.childIds?.[index],

                                          schoolId: selectedVan.schoolId,

                                          vanId: selectedVan.vanId,

                                          latitude: selectedVan.latitude,

                                          longitude: selectedVan.longitude,
                                        },
                                        "ABSENT",
                                      )
                                    }
                                  >
                                    <AlertTriangle className="w-4 h-4" />
                                    {loadingStudentId === studentId
                                      ? "Saving..."
                                      : "Absent"}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-2xl bg-neutral-50">
                    <Users className="w-10 h-10 mx-auto text-neutral-400 mb-3" />

                    <p className="text-neutral-600">No students available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 sm:p-6 flex flex-col sm:flex-row gap-3 justify-end">
              <div className="border-t p-4 sm:p-6 flex justify-end">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// const safeDistance = (d: number) => {
//   if (!d || d < 0) return 0;

//   // ignore unrealistic distances (over 200km for school van)
//   if (d > 200000) return 0;

//   return d;
// };

// Then:

// eta:
//   v.status === "arrived"
//     ? "Arrived"
//     : calculateETA(safeDistance(Number(v.distance))),
