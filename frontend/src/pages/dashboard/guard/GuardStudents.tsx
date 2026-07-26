import { useContext, useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Car,
  Phone,
  UserCheck,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import { socket } from "../../../sockets/socket";
// @ts-ignore
import useUpdateStudent from "../../../hooks/guard/put/useUpdateStudent";
//@ts-ignore
// import useUpdateAllStudents from "../../../hooks/guard/put/useUpdateAllStudents";
//@ts-ignore
import { getFileUrl } from "../../../api/apiConstant";

export default function GuardStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { user, logOut }: any = useContext(userContext);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingStudentId, setLoadingStudentId] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const { mutate: updateStudent } = useUpdateStudent();
  // const { mutate: updateAllStudents, isPending: updatingAll } =
  //   useUpdateAllStudents();

  const handleSelectStudent = (studentId: number) => {
    setSelectedStudents((prev: number[]) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handleSelectAll = () => {
    // .filter((s: any) => s.status === "pending")
    const pendingStudents = filteredStudents.map((s: any) => s.id);

    const allSelected = pendingStudents.every((id: number) =>
      selectedStudents.includes(id),
    );

    if (allSelected) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(pendingStudents);
    }
  };

  const handleVerifyStudent = (
    studentId: string,
    student: any,
    status: string,
  ) => {
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
          remarks: `Marked ${status.toLowerCase()} by guard`,
          verification_time: new Date().toISOString(),
        },
      },
      {
        onSettled: () => {
          socket.emit("new-notification", { status });
          setLoadingStudentId(null);
          getAllStudents();
        },
      },
    );
  };

  const handleBulkVerify = (status: string) => {
    if (!selectedStudents.length) return;

    const selectedData: any = normalizedStudents.find(
      (s: any) => s.id === selectedStudents[0],
    );

    if (!selectedData) return;

    setLoadingStudentId("bulk");

    updateStudent(
      {
        payload: {
          child_ids: selectedStudents,
          van_id: selectedData.vanId,
          school_id: selectedData.schoolId,
          verification_type: status,
          latitude: selectedData.latitude,
          longitude: selectedData.longitude,
          remarks: `Bulk ${status.toLowerCase()} by guard`,
          verification_time: new Date().toISOString(),
        },
      },
      {
        onSettled: () => {
          socket.emit("new-notification", { status });
          setLoadingStudentId(null);
          setSelectedStudents([]);
          getAllStudents();
        },
      },
    );
  };

  // const handleVerifyAll = () => {
  //   updateAllStudents(
  //     {
  //       payload: {
  //         verification_type: "VERIFIED",
  //       },
  //     },
  //     {
  //       onSettled: () => {
  //         getAllStudents();
  //       },
  //     },
  //   );
  // };

  const normalizedStudents = students.map((s: any) => {
    return {
      id: s.id,
      name: s.full_name,
      child_pic: s.child_pic,
      grade: s.grade,
      vanNumber: s.van_number_plate || "N/A",
      driver: s.driver_name || "N/A",
      expectedTime: "-", // not available
      actualTime: s.verification_time || null,
      status: s.verification_status?.toLowerCase() || "pending",
      parentName: s.parent_name,
      parentPhone: s.parent_phone,
      medicalInfo: s.disease || "None",
      vanId: s.van_id || "N/A",
      schoolId: s.school_id || "N/A",
      latitude: s.latitude || "N/A",
      longitude: s.longitude || "N/A",
      remarks: s.remarks || "N/A",
    };
  });
  console.log("normalizedStudents", normalizedStudents);

  const filteredStudents = normalizedStudents.filter((student: any) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.vanNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || student.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3" />
            Present
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "absent":
        return (
          <Badge variant="danger">
            <XCircle className="w-3 h-3" />
            Absent
          </Badge>
        );
      default:
        return null;
    }
  };

  const stats = [
    {
      title: "Expected Today",
      value: normalizedStudents.length,
      subtitle: "Total students",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
    {
      title: "Present",
      value: normalizedStudents.filter((s) => s.status === "verified").length,
      subtitle: "Checked in",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: normalizedStudents.filter((s) => s.status === "pending").length,
      subtitle: "Awaiting arrival",
      icon: Clock,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
    },
    {
      title: "Absent",
      value: normalizedStudents.filter((s) => s.status === "absent").length,
      subtitle: "Not arrived",
      icon: XCircle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
  ];

  const getAllStudents = () => {
    socket.off("all-students");

    socket.emit("get-all-students");

    socket.on("all-students", (data: any) => {
      console.log("data guard students", data);
      setStudents(data);
    });
  };

  useEffect(() => {
    getAllStudents();
    return () => socket.off("all-students");
  }, []);

  const verifiedCount = normalizedStudents.filter(
    (s) => s.status === "verified",
  ).length;

  const totalCount = normalizedStudents.length;

  const percentage = totalCount
    ? Math.round((verifiedCount / totalCount) * 100)
    : 0;

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
          title="Student Verification"
          subtitle="Verify student arrivals and mark attendance"
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

          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Verification Progress
                </h3>
                <span className="text-2xl font-bold text-primary">
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
              <p className="text-sm text-neutral-600 mt-2">
                {verifiedCount} of {totalCount} students verified
              </p>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by student name or van number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Present</option>
                  <option value="pending">Pending</option>
                  <option value="absent">Absent</option>
                </select>
                {/* <Button
                  variant="primary"
                  onClick={handleVerifyAll}
                  disabled={updatingAll}
                >
                  <UserCheck className="w-4 h-4" />
                  {updatingAll ? "Processing..." : "Present All Arrived"}
                </Button> */}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              variant="primary"
              disabled={!selectedStudents.length || loadingStudentId === "bulk"}
              onClick={() => handleBulkVerify("VERIFIED")}
            >
              <CheckCircle className="w-4 h-4" />
              Present Selected
            </Button>

            <Button
              variant="outline"
              className="text-accent hover:bg-accent-50"
              disabled={!selectedStudents.length || loadingStudentId === "bulk"}
              onClick={() => handleBulkVerify("ABSENT")}
            >
              <XCircle className="w-4 h-4" />
              Absent Selected
            </Button>
          </div>

          <div className="flex items-center gap-3 my-4">
            <input
              type="checkbox"
              checked={
                // filteredStudents.filter((s) => s.status === "pending").length >
                filteredStudents.length > 0 &&
                filteredStudents.every((s) => selectedStudents.includes(s.id))
                // .filter((s) => s.status === "pending")
              }
              onChange={handleSelectAll}
              className="w-5 h-5 accent-primary cursor-pointer"
            />

            <span className="text-sm font-medium text-neutral-700">
              Select All Students
            </span>
          </div>

          {/* Students List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card
                key={student.id}
                hover
                className={
                  student.status === "pending"
                    ? "border-2 border-highlight"
                    : "border-2 border-neutral-300"
                }
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* {student.status === "pending" && ( */}
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="w-5 h-5 accent-primary cursor-pointer"
                      />
                      {/* )} */}

                      <div className="flex items-center gap-3">
                        <Avatar
                          src={getFileUrl(student?.child_pic)}
                          name={student.name}
                          size="lg"
                        />

                        <div>
                          <h3 className="font-semibold text-neutral-900">
                            {student.name}
                          </h3>

                          <p className="text-sm text-neutral-600">
                            {student.grade}
                          </p>
                        </div>
                      </div>
                    </div>

                    {getStatusBadge(student.status)}
                  </div>

                  <div className="space-y-3">
                    {/* Van Info */}
                    <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                      <Car className="w-4 h-4 text-neutral-500" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-600">Van & Driver</p>
                        <p className="text-sm font-semibold text-neutral-900">
                          {student.vanNumber}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {student.driver}
                        </p>
                      </div>
                    </div>

                    {/* Timing */}
                    <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-600">
                          Expected Time
                        </p>
                        <p className="text-sm font-semibold text-neutral-900">
                          {student.expectedTime}
                        </p>
                        {student.actualTime && (
                          <p className="text-xs text-green-600">
                            Arrived: {student.actualTime}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Parent Contact */}
                    <div className="flex items-center gap-2 p-3 bg-secondary-50 rounded-lg">
                      <Phone className="w-4 h-4 text-secondary" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-600">Parent</p>
                        <p className="text-sm font-semibold text-neutral-900">
                          {student.parentName}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {student.parentPhone}
                        </p>
                      </div>
                    </div>

                    {/* Medical Info */}
                    {/* {student.medicalInfo && student.medicalInfo !== "None" && (
                      <div className="flex items-start gap-2 p-3 bg-highlight-50 rounded-lg border border-highlight-200">
                        <AlertTriangle className="w-4 h-4 text-highlight flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-neutral-600">
                            Medical Info
                          </p>
                          <p className="text-sm font-semibold text-neutral-900">
                            {student.medicalInfo}
                          </p>
                        </div>
                      </div>
                    )} */}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    {/* {student.status === "pending" && ( */}
                    <>
                      {/* <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleVerifyStudent(student.id, student, "VERIFIED")
                        }
                        disabled={loadingStudentId === student.id}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {loadingStudentId === student.id
                          ? "Processing..."
                          : "Present"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-accent hover:bg-accent-50"
                        onClick={() =>
                          handleVerifyStudent(student.id, student, "ABSENT")
                        }
                        disabled={loadingStudentId === student.id}
                      >
                        <XCircle className="w-4 h-4" />
                        {loadingStudentId === student.id
                          ? "Marking..."
                          : "Absent"}
                      </Button> */}
                    </>
                    {/* )} */}
                    {/* {(student.status === "verified" ||
                      student.status === "absent") && ( */}
                    {/* <Button
                        variant={
                          student.status === "verified" ? "primary" : "outline"
                        }
                        size="sm"
                        className="flex-1"
                      >
                        {student.status === "verified" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {student.status === "verified" ? "Verified" : "Absent"}
                      </Button> */}
                    {/* )} */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Student Details Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-neutral-500 hover:text-black"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <Avatar
                src={getFileUrl(selectedStudent?.child_pic)}
                name={selectedStudent.name}
                size="lg"
              />
              <div>
                <h2 className="text-lg font-bold">{selectedStudent.name}</h2>
                <p className="text-sm text-neutral-600">
                  {selectedStudent.grade}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Van</span>
                <span className="font-medium">{selectedStudent.vanNumber}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Driver</span>
                <span className="font-medium">{selectedStudent.driver}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Parent</span>
                <span className="font-medium">
                  {selectedStudent.parentName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Phone</span>
                <span className="font-medium">
                  {selectedStudent.parentPhone}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Status</span>
                <span className="font-medium capitalize">
                  {selectedStudent.status}
                </span>
              </div>

              {/* <div>
                <span className="text-neutral-500 block mb-1">
                  Medical Info
                </span>
                <span className="font-medium">
                  {selectedStudent.medicalInfo}
                </span>
              </div> */}

              {selectedStudent.actualTime && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Arrived At</span>
                  <span className="font-medium">
                    {selectedStudent.actualTime}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
