import { useContext, useState } from "react";
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
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Car,
  AlertTriangle,
  Users,
} from "lucide-react";
import userContext from "../../../context/userContext";

export default function GuardVerification() {
  const [selectedVan, setSelectedVan] = useState<number | null>(1);
  const { user, logOut }: any = useContext(userContext);

  const stats = [
    {
      title: "Total Students",
      value: "96",
      subtitle: "Expected today",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
    {
      title: "Verified",
      value: "38",
      subtitle: "Checked in",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: "58",
      subtitle: "Awaiting",
      icon: Clock,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
    },
    {
      title: "Issues",
      value: "0",
      subtitle: "Discrepancies",
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
  ];

  const vans = [
    {
      id: 1,
      vanNumber: "Van #A123",
      driver: "John Smith",
      status: "arrived",
      students: [
        {
          id: 1,
          name: "Emma Johnson",
          grade: "7th",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 2,
          name: "Oliver Smith",
          grade: "3rd",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 3,
          name: "Sophia Davis",
          grade: "5th",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 4,
          name: "Liam Wilson",
          grade: "6th",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 5,
          name: "Ava Martinez",
          grade: "4th",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 6,
          name: "Noah Anderson",
          grade: "8th",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 7,
          name: "Mia Taylor",
          grade: "2nd",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 8,
          name: "Ethan Brown",
          grade: "5th",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 9,
          name: "Isabella Garcia",
          grade: "3rd",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 10,
          name: "Lucas Martinez",
          grade: "7th",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 11,
          name: "Charlotte Lee",
          grade: "4th",
          verified: true,
          time: "7:46 AM",
        },
        {
          id: 12,
          name: "Mason White",
          grade: "6th",
          verified: true,
          time: "7:46 AM",
        },
      ],
    },
    {
      id: 2,
      vanNumber: "Van #B456",
      driver: "Sarah Williams",
      status: "arrived",
      students: [
        {
          id: 13,
          name: "Amelia Johnson",
          grade: "5th",
          verified: true,
          time: "7:50 AM",
        },
        {
          id: 14,
          name: "James Wilson",
          grade: "7th",
          verified: true,
          time: "7:50 AM",
        },
        {
          id: 15,
          name: "Harper Davis",
          grade: "3rd",
          verified: true,
          time: "7:50 AM",
        },
        {
          id: 16,
          name: "Benjamin Brown",
          grade: "6th",
          verified: true,
          time: "7:50 AM",
        },
        {
          id: 17,
          name: "Evelyn Miller",
          grade: "4th",
          verified: true,
          time: "7:50 AM",
        },
        {
          id: 18,
          name: "Alexander Moore",
          grade: "8th",
          verified: true,
          time: "7:50 AM",
        },
        {
          id: 19,
          name: "Abigail Taylor",
          grade: "2nd",
          verified: true,
          time: "7:50 AM",
        },
        {
          id: 20,
          name: "Michael Anderson",
          grade: "5th",
          verified: true,
          time: "7:50 AM",
        },
        {
          id: 21,
          name: "Emily Thomas",
          grade: "3rd",
          verified: true,
          time: "7:50 AM",
        },
        {
          id: 22,
          name: "Daniel Jackson",
          grade: "7th",
          verified: true,
          time: "7:50 AM",
        },
      ],
    },
    {
      id: 3,
      vanNumber: "Van #C789",
      driver: "Michael Brown",
      status: "arrived",
      students: [
        {
          id: 23,
          name: "Sofia White",
          grade: "4th",
          verified: true,
          time: "7:55 AM",
        },
        {
          id: 24,
          name: "Matthew Harris",
          grade: "6th",
          verified: true,
          time: "7:55 AM",
        },
        {
          id: 25,
          name: "Avery Martin",
          grade: "5th",
          verified: true,
          time: "7:55 AM",
        },
        {
          id: 26,
          name: "Joseph Thompson",
          grade: "8th",
          verified: true,
          time: "7:55 AM",
        },
        {
          id: 27,
          name: "Ella Garcia",
          grade: "3rd",
          verified: true,
          time: "7:55 AM",
        },
        {
          id: 28,
          name: "David Martinez",
          grade: "7th",
          verified: true,
          time: "7:55 AM",
        },
        {
          id: 29,
          name: "Scarlett Robinson",
          grade: "2nd",
          verified: true,
          time: "7:55 AM",
        },
        {
          id: 30,
          name: "Jackson Clark",
          grade: "5th",
          verified: true,
          time: "7:55 AM",
        },
      ],
    },
    {
      id: 4,
      vanNumber: "Van #D012",
      driver: "Robert Lee",
      status: "approaching",
      students: [
        {
          id: 31,
          name: "Victoria Rodriguez",
          grade: "4th",
          verified: false,
          time: null,
        },
        {
          id: 32,
          name: "Sebastian Lewis",
          grade: "6th",
          verified: false,
          time: null,
        },
        {
          id: 33,
          name: "Grace Lee",
          grade: "5th",
          verified: false,
          time: null,
        },
        {
          id: 34,
          name: "Henry Walker",
          grade: "8th",
          verified: false,
          time: null,
        },
        {
          id: 35,
          name: "Chloe Hall",
          grade: "3rd",
          verified: false,
          time: null,
        },
        {
          id: 36,
          name: "Samuel Allen",
          grade: "7th",
          verified: false,
          time: null,
        },
        {
          id: 37,
          name: "Zoey Young",
          grade: "2nd",
          verified: false,
          time: null,
        },
        {
          id: 38,
          name: "Owen Hernandez",
          grade: "5th",
          verified: false,
          time: null,
        },
        {
          id: 39,
          name: "Lily King",
          grade: "4th",
          verified: false,
          time: null,
        },
        {
          id: 40,
          name: "Jack Wright",
          grade: "6th",
          verified: false,
          time: null,
        },
        {
          id: 41,
          name: "Aria Lopez",
          grade: "3rd",
          verified: false,
          time: null,
        },
        {
          id: 42,
          name: "Luke Hill",
          grade: "7th",
          verified: false,
          time: null,
        },
        {
          id: 43,
          name: "Nora Scott",
          grade: "5th",
          verified: false,
          time: null,
        },
        {
          id: 44,
          name: "Ryan Green",
          grade: "8th",
          verified: false,
          time: null,
        },
      ],
    },
  ];

  const selectedVanData = vans.find((v) => v.id === selectedVan);

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

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Van List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Vans</CardTitle>
                  <CardDescription>
                    Select a van to verify students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vans.map((van) => (
                      <button
                        key={van.id}
                        onClick={() => setSelectedVan(van.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedVan === van.id
                            ? "border-primary bg-primary-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                              <Car className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-neutral-900">
                                {van.vanNumber}
                              </p>
                              <p className="text-xs text-neutral-600">
                                {van.driver}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              van.status === "arrived" ? "success" : "warning"
                            }
                          >
                            {van.status === "arrived"
                              ? "Arrived"
                              : "Approaching"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">
                            {van.students.filter((s) => s.verified).length}/
                            {van.students.length} verified
                          </span>
                          <div className="w-20 bg-neutral-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                van.students.filter((s) => s.verified)
                                  .length === van.students.length
                                  ? "bg-green-500"
                                  : "bg-primary"
                              }`}
                              style={{
                                width: `${(van.students.filter((s) => s.verified).length / van.students.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Verification */}
            <div className="lg:col-span-2">
              {selectedVanData ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedVanData.vanNumber}</CardTitle>
                        <CardDescription>
                          Driver: {selectedVanData.driver} •{" "}
                          {selectedVanData.students.length} students
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            selectedVanData.status === "arrived"
                              ? "success"
                              : "warning"
                          }
                        >
                          {selectedVanData.status === "arrived" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {selectedVanData.status === "arrived"
                            ? "Arrived"
                            : "Approaching"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Progress */}
                    <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Verification Progress
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {Math.round(
                            (selectedVanData.students.filter((s) => s.verified)
                              .length /
                              selectedVanData.students.length) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            selectedVanData.students.filter((s) => s.verified)
                              .length === selectedVanData.students.length
                              ? "bg-green-500"
                              : "bg-primary"
                          }`}
                          style={{
                            width: `${
                              (selectedVanData.students.filter(
                                (s) => s.verified,
                              ).length /
                                selectedVanData.students.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Quick Actions */}
                    {selectedVanData.status === "arrived" &&
                      selectedVanData.students.some((s) => !s.verified) && (
                        <div className="mb-6">
                          <Button variant="primary" className="w-full">
                            <UserCheck className="w-4 h-4" />
                            Verify All Students
                          </Button>
                        </div>
                      )}

                    {/* Student List */}
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {selectedVanData.students.map((student) => (
                        <div
                          key={student.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            student.verified
                              ? "border-green-200 bg-green-50"
                              : "border-neutral-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar name={student.name} size="md" />
                              <div className="flex-1">
                                <p className="font-semibold text-neutral-900">
                                  {student.name}
                                </p>
                                <p className="text-sm text-neutral-600">
                                  {student.grade} Grade
                                </p>
                                {student.time && (
                                  <p className="text-xs text-green-600">
                                    Verified at {student.time}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {student.verified ? (
                                <Badge variant="success">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </Badge>
                              ) : (
                                <>
                                  <Button variant="primary" size="sm">
                                    <CheckCircle className="w-4 h-4" />
                                    Verify
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-accent hover:bg-accent-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Complete Message */}
                    {selectedVanData.students.every((s) => s.verified) && (
                      <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-semibold text-green-900">
                              All Students Verified
                            </p>
                            <p className="text-sm text-green-700">
                              All {selectedVanData.students.length} students
                              have been checked in successfully
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <UserCheck className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Select a Van
                    </h3>
                    <p className="text-neutral-600">
                      Choose a van from the list to verify students
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
