import { useContext, useState, useMemo } from "react";
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
  Search,
  Phone,
  MapPin,
  School,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Mail,
  X,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useAllStudents from "../../../hooks/drivers/get/useAllStudents";
//@ts-ignore
import { getFileUrl } from "../../../api/apiConstant";

export default function DriverStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRoute, setFilterRoute] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { user, logOut }: any = useContext(userContext);

  // fetch all students assigned to this driver
  const { data: studentsData, isLoading, isError, error } = useAllStudents();

  // normalize students array from API response
  const studentsArray = useMemo(() => {
    if (!studentsData) return [];
    if (Array.isArray(studentsData)) return studentsData;
    return studentsData?.students || studentsData?.data || [];
  }, [studentsData]);

  // normalize each student object to match UI expectations
  const normalizedStudents = useMemo(() => {
    return studentsArray.map((s: any) => {
      const child = s.child_info || {};
      const parent = s.parent_data || {};
      const driver = s.driver_data || {};
      const booking = s.booking_info || {};
      const route = s.route_info || {};
      const school = s.school_info || {};
      const attendance = s.attendance_info || {};

      return {
        id: child.id || s.id || child.student_id,
        name: child.full_name || child.name || child.student_name || "Student",
        age:
          child.age ||
          (child.date_of_birth
            ? new Date().getFullYear() -
              new Date(child.date_of_birth).getFullYear()
            : 0),
        grade: child.grade || child.class || child.standard || "-",
        childPic: child.child_pic || child.profile_photo || "-",
        school:
          school.address ||
          school.name ||
          school.school_name ||
          child.school_name ||
          "-",
        route: route.name || route.route_name || s.route_name || "Unassigned",
        pickupAddress:
          school.address || child.address || child.home_address || "-",
        pickupTime:
          school.pickup_time ||
          child.pickup_time ||
          school.scheduled_pickup ||
          "-",
        dropTime:
          school.drop_off_time ||
          child.drop_time ||
          school.scheduled_drop ||
          "-",
        parentName:
          parent.full_name ||
          parent.name ||
          parent.parent_name ||
          child.parent_name ||
          "-",
        parentPhone:
          parent.phone ||
          parent.parent_contact ||
          parent.guardian_phone ||
          child.emergency_contact ||
          "-",
        parentEmail:
          parent.email || parent.parent_email || parent.guardian_email || "-",
        emergencyContact:
          child.emergency_contact ||
          parent.phone ||
          parent.emergency_phone ||
          "-",
        medicalInfo:
          child.disease ||
          child.medical_info ||
          child.medical_information ||
          child.health_info ||
          "None",
        status: booking.status || booking.booking_status || "ACTIVE",
        attendance: attendance.attendance_percentage || 0,
        lastPickup: booking.booked_at
          ? new Date(booking.booked_at).toLocaleDateString()
          : "-",
      };
    });
  }, [studentsArray]);

  const students = normalizedStudents;

  const filteredStudents = students.filter((student: any) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoute = filterRoute === "all" || student.route === filterRoute;
    return matchesSearch && matchesRoute;
  });

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
          title="My Students"
          subtitle="Manage and view all assigned students"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card hover>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {isLoading ? "..." : students.length}
                </h3>
                <p className="text-sm text-neutral-600">Total Students</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {isLoading
                    ? "..."
                    : students.filter((s: any) => s.status === "ACTIVE").length}
                </h3>
                <p className="text-sm text-neutral-600">Active</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center mb-4">
                  <School className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {isLoading
                    ? "..."
                    : new Set(students.map((s: any) => s.school)).size}
                </h3>
                <p className="text-sm text-neutral-600">Schools</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-highlight-50 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-highlight" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {isLoading
                    ? "..."
                    : students.length > 0
                      ? Math.round(
                          students.reduce(
                            (acc: any, s: any) => acc + (s.attendance || 0),
                            0,
                          ) / students.length,
                        )
                      : 0}
                  %
                </h3>
                <p className="text-sm text-neutral-600">Avg Attendance</p>
              </CardContent>
            </Card>
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
                      placeholder="Search by student or parent name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
                {/* <select
                  value={filterRoute}
                  onChange={(e) => setFilterRoute(e.target.value)}
                  className="px-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none"
                >
                  <option value="all">All Routes</option>
                  <option value="Route A - Morning">Route A - Morning</option>
                  <option value="Route A - Afternoon">
                    Route A - Afternoon
                  </option>
                </select> */}
                {/* <Button variant="outline">
                  <Download className="w-4 h-4" />
                  Export List
                </Button> */}
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <div className="grid lg:grid-cols-2 gap-6">
            {isLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div>Loading students...</div>
                </CardContent>
              </Card>
            ) : isError ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-red-600">
                    Error loading students: {error?.message}
                  </div>
                </CardContent>
              </Card>
            ) : filteredStudents.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    No students found
                  </h3>
                  <p className="text-neutral-600">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredStudents.map((student: any) => (
                <Card key={student.id} hover>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {student.childPic ? (
                          <Avatar
                            src={getFileUrl(student.childPic)}
                            size="xl"
                          />
                        ) : (
                          <Avatar name={student.name} size="xl" />
                        )}

                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {student.name}
                            <Badge variant="success">
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {student.age} years • {student.grade}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* School */}
                      <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                        <School className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">
                            School
                          </p>
                          <p className="text-sm text-neutral-600">
                            {student.school}
                          </p>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">
                            Route & Pickup
                          </p>
                          <p className="text-sm text-neutral-600">
                            {student.route}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {student.pickupAddress}
                          </p>
                        </div>
                      </div>

                      {/* Timing */}
                      <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                        <Clock className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">
                            Pickup Time
                          </p>
                          <p className="text-sm text-neutral-600">
                            {student.pickupTime} • Drop: {student.dropTime}
                          </p>
                        </div>
                      </div>

                      {/* Parent Contact */}
                      <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                        <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">
                            Parent Contact
                          </p>
                          <p className="text-sm text-neutral-700">
                            {student.parentName}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {student.parentPhone}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {student.parentEmail}
                          </p>
                        </div>
                      </div>

                      {/* Medical Info */}
                      {student.medicalInfo &&
                        student.medicalInfo !== "None" && (
                          <div className="flex items-start gap-3 p-3 bg-highlight-50 rounded-lg border border-highlight-200">
                            <AlertTriangle className="w-5 h-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-neutral-900">
                                Medical Information
                              </p>
                              <p className="text-sm text-neutral-700">
                                {student.medicalInfo}
                              </p>
                            </div>
                          </div>
                        )}

                      {/* Attendance */}
                      {/* <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            Attendance Rate
                          </p>
                          <p className="text-xs text-neutral-600">
                            Last pickup: {student.lastPickup}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {student.attendance}%
                          </p>
                        </div>
                      </div> */}
                    </div>

                    <div className="flex gap-2 mt-4">
                      {/* <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="w-4 h-4" />
                        Call Parent
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="w-4 h-4" />
                        Message
                      </Button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowDetailsModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src={getFileUrl(selectedStudent.childPic)}
                  name={selectedStudent.name}
                  size="lg"
                />
                <div>
                  <CardTitle>{selectedStudent.name}</CardTitle>
                  <CardDescription>
                    {selectedStudent.age} years • {selectedStudent.grade}
                  </CardDescription>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedStudent(null);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge variant="success">
                  <CheckCircle className="w-3 h-3" />
                  {selectedStudent.status}
                </Badge>
              </div>

              {/* School Information */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  School Information
                </h3>
                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                  <School className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      School
                    </p>
                    <p className="text-sm text-neutral-600">
                      {selectedStudent.school}
                    </p>
                  </div>
                </div>
              </div>

              {/* Route & Location Information */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Route & Location
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">
                        Route
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedStudent.route}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">
                        Home Address
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedStudent.pickupAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timing Information */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Schedule
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <Clock className="w-5 h-5 text-highlight flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-neutral-900">
                        Pickup Time
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedStudent.pickupTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-neutral-900">
                        Drop Time
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedStudent.dropTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent Contact Information */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Parent Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">
                        {selectedStudent.parentName}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedStudent.parentPhone}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {selectedStudent.parentEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <Phone className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">
                        Emergency Contact
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedStudent.emergencyContact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              {selectedStudent.medicalInfo &&
                selectedStudent.medicalInfo !== "None" && (
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-neutral-900 mb-3">
                      Medical Information
                    </h3>
                    <div className="flex items-start gap-3 p-3 bg-highlight-50 rounded-lg border border-highlight-200">
                      <AlertTriangle className="w-5 h-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900">
                          Health Conditions
                        </p>
                        <p className="text-sm text-neutral-700">
                          {selectedStudent.medicalInfo}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Attendance Information */}
              {/* <div>
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Attendance
                </h3>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      Overall Attendance Rate
                    </p>
                    <p className="text-xs text-neutral-600">
                      Last pickup: {selectedStudent.lastPickup}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">
                      {selectedStudent.attendance}%
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {/* <Button variant="primary" className="flex-1">
                  <Phone className="w-4 h-4" />
                  Call Parent
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="w-4 h-4" />
                  Message
                </Button> */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedStudent(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
