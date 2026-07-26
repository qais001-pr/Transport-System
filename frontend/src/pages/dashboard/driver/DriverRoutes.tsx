import { useContext, useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Users,
  Navigation,
  School,
  CheckCircle,
  Eye,
  Copy,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useMyRoutes from "../../../hooks/drivers/get/useMyRoutes";
//@ts-ignore
import useCreateNewRoute from "../../../hooks/drivers/useCreateNewRoute";
//@ts-ignore
import useRouteDetail from "../../../hooks/drivers/get/useRouteDetail";
//@ts-ignore
import useDeleteRoute from "../../../hooks/drivers/useDeleteRoute";
import { toast } from "react-toastify";

export default function DriverRoutes() {
  const { user, logOut }: any = useContext(userContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    pickup_address: "",
    van_id: "",
    stops: [],
  });

  // fetch routes from API
  const { data: routesData, isLoading, isError, error } = useMyRoutes();
  const { mutate: createRoute, isPending: isCreatingRoute } =
    useCreateNewRoute();
  const { data: routeDetail, refetch } = useRouteDetail({
    enabled: false,
  });
  const { mutate: deleteRoute } = useDeleteRoute();
  const vans = routeDetail?.route?.[0]?.vans || [];
  const children = routeDetail?.route?.[0]?.children || [];

  useEffect(() => {
    if (isModalOpen) {
      refetch();
    }
  }, [isModalOpen]);

  // normalize routes array from API response
  const routesArray = useMemo(() => {
    if (!routesData) return [];
    if (Array.isArray(routesData)) return routesData;
    return routesData?.routes || routesData?.data || [];
  }, [routesData]);

  // normalize each route with flexible field mapping
  const normalizedRoutes = useMemo(() => {
    return routesArray.map((r: any) => {
      const schoolObj = r.school || {};
      const stopsArray = Array.isArray(r.stops) ? r.stops : [];
      return {
        id: r.id || r._id || r.route_id,
        name: r.name || r.route_name || "Route",
        type:
          r.type ||
          (r.name?.toLowerCase().includes("pickup") ? "pickup" : "dropoff") ||
          "other",
        school:
          schoolObj.name || schoolObj.school_name || schoolObj.address || "-",
        startTime: r.start_time || schoolObj.start_time || "-",
        endTime: r.end_time || schoolObj.end_time || "-",
        totalStops: parseInt(r.total_stops) || stopsArray.length || 0,
        students: parseInt(r.total_students) || 0,
        distance: r.distance || "—",
        estimatedDuration: r.duration || r.estimated_duration || "—",
        status: r.is_active ? "active" : r.status || "inactive",
        days: r.days || ["Mon", "Tue", "Wed", "Thu", "Fri"],
        stops:
          stopsArray.map((stop: any, index: number) => ({
            order: stop.sequence_no || index + 1,
            address: stop.address || `Stop ${stop.sequence_no || index + 1}`,
            location: { latitude: stop.latitude, longitude: stop.longitude },
            student: stop.student_name || stop.name || stop.student || `-`,
            time: schoolObj.start_time || stop.arrival_time || "-",
            status:
              index === 0
                ? "origin"
                : index === stopsArray.length - 1
                  ? "destination"
                  : "active",
          })) || [],
      };
    });
  }, [routesArray]);

  const routes = normalizedRoutes;

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!formData.van_id || formData.stops.length === 0) {
      toast.error("Please select a van and add stops");
      return;
    }

    const selectedStops = children
      .filter((c: any) => formData.stops.includes(c.child_id))
      .map((c: any) => ({
        lat: c.lat,
        lng: c.lng,
      }));

    console.log(selectedStops);
    console.log(formData);

    createRoute(
      {
        van_id: formData.van_id,
        stops: selectedStops,
        pickup_address: formData.pickup_address,
      },
      {
        onSuccess: () => {
          setFormData({
            pickup_address: "",
            van_id: "",
            stops: [],
          });
          setIsModalOpen(false);
        },
      },
    );
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
          title="My Routes"
          subtitle="Manage and optimize your transportation routes"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card hover>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {isLoading ? "..." : routes.length}
                </h3>
                <p className="text-sm text-neutral-600">Active Routes</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {isLoading
                    ? "..."
                    : routes.reduce(
                        (acc: number, route: any) => acc + route.totalStops,
                        0,
                      )}
                </h3>
                <p className="text-sm text-neutral-600">Total Stops</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-highlight-50 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-highlight" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {isLoading
                    ? "..."
                    : routes.reduce(
                        (acc: number, route: any) => acc + route.students,
                        0,
                      )}
                </h3>
                <p className="text-sm text-neutral-600">Total Students</p>
              </CardContent>
            </Card>

            {/* <Card hover>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {isLoading ? "..." : "—"}
                </h3>
                <p className="text-sm text-neutral-600">Total Distance</p>
              </CardContent>
            </Card> */}
          </div>

          {/* Add Route Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Create New Route
          </Button>

          {/* Routes List */}
          <div className="space-y-6 mt-2">
            {isLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div>Loading routes...</div>
                </CardContent>
              </Card>
            ) : isError ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-red-600">
                    Error loading routes: {error?.message}
                  </div>
                </CardContent>
              </Card>
            ) : routes.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Navigation className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    No routes found
                  </h3>
                  <p className="text-neutral-600">
                    Create your first route to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              routes.map((route: any) => (
                <Card key={route.id} hover>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        {/* <div className="flex items-center gap-3 mb-2">
                          <CardTitle>
                            {route?.name.slice(0, 20) || "No Route"}
                          </CardTitle>
                          <Badge
                            variant={
                              route.type === "pickup" ? "primary" : "secondary"
                            }
                          >
                            {route.type === "pickup" ? "Pickup" : "Drop-off"}
                          </Badge>
                          <Badge variant="success">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </Badge>
                        </div> */}
                        <CardDescription className="flex items-center gap-2">
                          <School className="w-4 h-4" />
                          {route.school}
                          <Badge variant="success">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {/* <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button> */}
                        {/* <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </Button> */}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Route Info Grid */}
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                        <Clock className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-xs text-neutral-600">Time</p>
                          <p className="text-sm font-semibold text-neutral-900">
                            {route.startTime} - {route.endTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-xs text-neutral-600">Stops</p>
                          <p className="text-sm font-semibold text-neutral-900">
                            {route.totalStops} locations
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                        <Users className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-xs text-neutral-600">Students</p>
                          <p className="text-sm font-semibold text-neutral-900">
                            {route.students} children
                          </p>
                        </div>
                      </div>

                      {/* <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                        <Navigation className="w-5 h-5 text-neutral-500" />
                        <div>
                          <p className="text-xs text-neutral-600">Distance</p>
                          <p className="text-sm font-semibold text-neutral-900">
                            {route.distance}
                          </p>
                        </div>
                      </div> */}
                    </div>

                    {/* Days */}
                    {/* <div className="mb-6">
                      <p className="text-sm font-medium text-neutral-700 mb-2">
                        Active Days
                      </p>
                      <div className="flex gap-2">
                        {route.days.map((day: any) => (
                          <Badge
                            key={day}
                            variant="secondary"
                            className="text-xs"
                          >
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div> */}

                    {/* Route Stops */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-neutral-900">
                          Route Stops
                        </h4>
                        {/* <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                          View Map
                        </Button> */}
                      </div>
                      <div className="space-y-3">
                        {route.stops.map((stop: any, index: number) => (
                          <div key={index} className="flex items-start gap-4">
                            {/* Timeline */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  stop.status === "origin"
                                    ? "bg-secondary text-white"
                                    : stop.status === "destination"
                                      ? "bg-primary text-white"
                                      : "bg-neutral-200 text-neutral-700"
                                }`}
                              >
                                {stop.order}
                              </div>
                              {index < route.stops.length - 1 && (
                                <div className="w-0.5 h-8 bg-neutral-200" />
                              )}
                            </div>

                            {/* Stop Details */}
                            <div className="flex-1 pb-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  {/* <p className="font-semibold text-neutral-900">
                                    {stop.address}
                                  </p> */}
                                  {stop.location && (
                                    <p className="text-xs text-neutral-600 w-4/5">
                                      {/* {stop.location.latitude?.toFixed(4)},{" "}
                                      {stop.location.longitude?.toFixed(4)} */}
                                      {route?.name || "No Route"}
                                    </p>
                                  )}
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {stop.time}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button variant="primary" className="flex-1">
                        <Navigation className="w-4 h-4" />
                        Start Navigation
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          (window.location.href = "/dashboard/driver/students")
                        }
                      >
                        <Users className="w-4 h-4" />
                        View Students
                      </Button>
                      <Button
                        variant="outline"
                        className="text-accent hover:bg-accent-50"
                        onClick={() => deleteRoute({ routeId: route.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create Route</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="van_id"
                value={formData.van_id}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              >
                <option value="">Select Van</option>
                {vans.map((v: any) => (
                  <option key={v.id} value={v.id}>
                    {v.number_plate}
                  </option>
                ))}
              </select>

              <div className="border rounded p-3 max-h-40 overflow-y-auto">
                {children.map((child: any) => (
                  <label
                    key={child.child_id}
                    className="flex items-center gap-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.stops.includes(child.child_id)}
                      onChange={() => {
                        const exists = formData.stops.includes(child.child_id);

                        let updatedStops = exists
                          ? formData.stops.filter((id) => id !== child.child_id)
                          : [...formData.stops, child.child_id];

                        setFormData({
                          ...formData,
                          stops: updatedStops,
                          pickup_address: updatedStops.length
                            ? children.find(
                                (c: any) => c.child_id === updatedStops[0],
                              )?.address || ""
                            : "",
                        });
                      }}
                    />
                    <span>
                      <strong>Name:</strong> {child.name} -{" "}
                      <strong>Address:</strong> {child.address}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreatingRoute}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  {isCreatingRoute ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
