import { useMemo, useState } from "react";
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
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  X,
} from "lucide-react";
import { useContext } from "react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useSchoolDrivers from "../../../hooks/schools/get/useSchoolDrivers";
//@ts-ignore
import SpecificDriverComplaints from "./sections/SpecificDriverComplaints";

export default function SchoolDashboard() {
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "approved" | "pending" | "rejected"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logOut }: any = useContext(userContext);
  const [isShowDriverComplaints, setIsShowDriverComplaints] = useState(false);

  const { data: driversData, isLoading, error } = useSchoolDrivers();

  const drivers = useMemo(() => {
    return (
      driversData?.map((d: any) => ({
        id: Number(d.id),
        name: d.full_name,
        email: d.email,
        phone: d.phone,
        vanNumber: d.van_number || "N/A",
        route: d.route_name || "Not Assigned",
        verificationStatus: d.status.toLowerCase(),
        totalComplaints: Number(d.total_complaints || 0),
        avgRating: Number(d.average_rating || 0),
        performanceScore: Number(d.performance_score || 0),
        totalTrips: Number(d.total_bookings || 0),
        experienceMonths: 0,
        cnic: "N/A",
      })) || []
    );
  }, [driversData]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver: any) => {
      const matchesStatus =
        filterStatus === "all" || driver.verificationStatus === filterStatus;

      const matchesSearch =
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phone.includes(searchQuery) ||
        driver.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [drivers, filterStatus, searchQuery]);

  const selectedItem = selectedDriver
    ? drivers.find((d: any) => d.id === selectedDriver)
    : null;

  const stats = [
    {
      title: "approved Drivers",
      value: drivers
        .filter((d: any) => d.verificationStatus === "approved")
        .length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Verification",
      value: drivers
        .filter((d: any) => d.verificationStatus === "pending")
        .length.toString(),
      icon: Clock,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
    },
    {
      title: "Total Complaints",
      value: drivers
        .reduce((sum: any, d: any) => sum + (d.totalComplaints || 0), 0)
        .toString(),
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
    {
      title: "Total Drivers",
      value: drivers.length.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {isShowDriverComplaints && (
        <SpecificDriverComplaints
          driverId={selectedDriver}
          onClose={() => setIsShowDriverComplaints(false)}
        />
      )}
      <Sidebar
        userRole={user?.role || "Guest"}
        userName={user?.full_name || "Zaman Ali"}
        userEmail={user?.email || "zaman.ali@example.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header
          title="Driver Management Dashboard"
          subtitle="Verify drivers and manage complaints for your school"
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
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Search Driver
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, CNIC, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-3 sm:px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">All Drivers</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Drivers List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Drivers List ({filteredDrivers.length})</CardTitle>
                  <CardDescription>
                    Click a driver to view full details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading && (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2 animate-spin" />
                      <p className="text-neutral-600">Loading drivers...</p>
                    </div>
                  )}
                  {error && (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="text-accent">
                        {error || "Failed to load drivers. Please try again."}
                      </p>
                    </div>
                  )}
                  <div className="space-y-3 max-h-96 sm:max-h-none overflow-y-auto">
                    {filteredDrivers.length > 0 ? (
                      filteredDrivers.map((driver: any) => (
                        <div
                          key={driver.id}
                          onClick={() => setSelectedDriver(driver.id)}
                          className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            selectedDriver === driver.id
                              ? "border-primary bg-primary-50"
                              : "border-neutral-200 bg-white hover:border-primary"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <Avatar
                                name={driver.name}
                                size="md"
                                className="flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-neutral-900 text-sm">
                                    {driver.name}
                                  </h4>
                                  {driver.totalComplaints > 2 && (
                                    <Badge
                                      variant="warning"
                                      className="text-xs"
                                    >
                                      ⚠️ {driver.totalComplaints} complaints
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-600 truncate">
                                  {driver.vanNumber} • {driver.route.slice(0, 50)}...
                                </p>
                                <div className="flex gap-2 text-xs text-neutral-500 mt-1">
                                  <span>
                                    ⭐ {(driver.avgRating || 0).toFixed(1)}
                                  </span>
                                  <span>•</span>
                                  <span>{driver.performanceScore}% score</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge
                                variant={
                                  driver.verificationStatus === "approved"
                                    ? "success"
                                    : driver.verificationStatus === "rejected"
                                      ? "danger"
                                      : "warning"
                                }
                                className="text-xs capitalize"
                              >
                                {driver.verificationStatus === "approved" ? (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                ) : driver.verificationStatus === "rejected" ? (
                                  <X className="w-3 h-3 mr-1" />
                                ) : (
                                  <Clock className="w-3 h-3 mr-1" />
                                )}
                                {driver.verificationStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : !isLoading && !error ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                        <p className="text-neutral-600">No drivers found</p>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              {selectedItem ? (
                <Card className="sticky top-6 h-fit max-h-96 sm:max-h-none overflow-y-auto">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">
                          {selectedItem.name}
                        </CardTitle>
                        {/* <CardDescription className="text-xs">
                          {selectedItem.cnic}
                        </CardDescription> */}
                      </div>
                      <Badge
                        variant={
                          selectedItem.verificationStatus === "approved"
                            ? "success"
                            : selectedItem.verificationStatus === "rejected"
                              ? "danger"
                              : "warning"
                        }
                        className="text-xs whitespace-nowrap flex-shrink-0 capitalize"
                      >
                        {selectedItem.verificationStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {/* Contact Info */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Contact
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{selectedItem.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{selectedItem.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Route Information
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50 p-3 rounded">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{selectedItem.route}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Van Number:</span>
                          <span className="font-medium">
                            {selectedItem.vanNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Performance
                      </p>
                      <div className="space-y-2 text-xs text-neutral-600">
                        <div className="flex justify-between">
                          <span>Rating:</span>
                          <span className="font-medium">
                            ⭐ {(selectedItem.avgRating || 0).toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Performance Score:</span>
                          <span
                            className={
                              selectedItem.performanceScore >= 80
                                ? "text-green-600 font-medium"
                                : "text-accent font-medium"
                            }
                          >
                            {selectedItem.performanceScore}%
                          </span>
                        </div>
                        {/* <div className="flex justify-between">
                          <span>Total Trips:</span>
                          <span className="font-medium">
                            {selectedItem.totalTrips}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span className="font-medium">
                            {selectedItem.experienceMonths} months
                          </span>
                        </div> */}
                      </div>
                    </div>

                    {/* Complaints */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">
                        Complaints
                      </p>
                      <Badge
                        variant={
                          selectedItem.totalComplaints === 0
                            ? "success"
                            : selectedItem.totalComplaints <= 2
                              ? "warning"
                              : "danger"
                        }
                        className="w-full justify-center"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {selectedItem.totalComplaints} total
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="border-t pt-4 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 text-xs h-8"
                        variant="secondary"
                        onClick={() => setIsShowDriverComplaints(true)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        View Complaints
                      </Button>
                      {/* <Button
                        size="sm"
                        className="flex-1 text-xs h-8"
                        variant="secondary"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-600 text-sm">
                      Select a driver to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
