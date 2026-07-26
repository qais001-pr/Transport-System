import React, { useContext, useState } from "react";
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
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  School,
  MapPin,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
//@ts-ignore
import useGetAllSchools from "../../../hooks/schools/useGetAllSchools";
//@ts-ignore
import useAddChild from "../../../hooks/parents/useAddChildren";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import { toast } from "react-toastify";
//@ts-ignore
import { useChildren } from "../../../hooks/parents/get/useChildren";
//@ts-ignore
import { getFileUrl } from "../../../api/apiConstant";
//@ts-ignore
import useUpdateChildDetail from "../../../hooks/parents/useUpdateChildDetail";
//@ts-ignore
import useDeleteChild from "../../../hooks/parents/useDeleteChild";
//@ts-ignore
import useCancelBooking from "../../../hooks/parents/useCancelBooking";
//@ts-ignore
import ChildAddress from "../../../map/ChildAddress";

interface Child {
  id: string | number;
  full_name: string;
  age: number;
  date_of_birth: string;
  gender: string;
  grade: string;
  school_name: string;
  emergency_contact: string | null;
  disease: string;
  requires_girls_only: boolean;
  van_requires_girls_only: boolean;
  guardian?: string;
  parent_id?: string;
  school_id?: string;
  number_plate?: string | null;
  status?: string;
  vanAssigned?: string;
  driver?: string;
  pickup_address?: string;
  medicalInfo?: string;
  photo?: string | null;
  child_pic?: string | null;
  branch_id: string | number;
  latitude: number;
  longitude: number;
}

export default function ParentChildren() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const { user, logOut }: any = useContext(userContext);
  const [selectedSchool, setSelectedSchool] = useState<string | number>("");
  const [selectedBranch, setSelectedBranch] = useState<string | number>("");

  const { mutate: addChildren, isPending: isAddingChild } = useAddChild();
  const { mutate: updateChild, isPending: isUpdatingChild } =
    useUpdateChildDetail();
  const { mutate: deleteChild } = useDeleteChild();

  const { data: schoolsData } = useGetAllSchools();
  const schools = schoolsData || [];
  const selectedSchoolBranches =
    schools.find((s: any) => s.id === selectedSchool)?.school_branches || [];

  const [addChild, setAddChild] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    grade: "",
    emergency_contact: "",
    disease: "",
    requires_girls_only: false,
    child_pic: null as File | null,
    pickup_address: "",
    latitude: 0,
    longitude: 0,
  });

  const [editChild, setEditChild] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    grade: "",
    school_id: 0,
    branch_id: 0,
    emergency_contact: "",
    disease: "",
    requires_girls_only: false,
    child_pic: null as File | null,
    pickup_address: "",
    latitude: 0,
    longitude: 0,
  });

  // const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [displayedSchoolName, setDisplayedSchoolName] = useState("");

  const {
    data: childrenData,
    isLoading: childrenLoading,
    isError: childrenError,
  } = useChildren();
  console.log(childrenData);

  // const filteredSchools =
  //   schools?.filter((school: any) =>
  //     school.school_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  //   ) || [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (name === "child_pic") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setAddChild((prev) => ({ ...prev, child_pic: file }));
    } else {
      setAddChild((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  // Handle loading state
  if (childrenLoading) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar
          userRole={user?.role || "Guest"}
          userName={user?.full_name || "Guest"}
          userEmail={user?.email || "guest@example.com"}
          logOut={logOut}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading children...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (childrenError) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar
          userRole={user?.role || "Guest"}
          userName={user?.full_name || "Guest"}
          userEmail={user?.email || "guest@example.com"}
          logOut={logOut}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-neutral-600">
              Failed to load children. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddChild = () => {
    const {
      full_name,
      date_of_birth,
      gender,
      grade,
      requires_girls_only,
      pickup_address,
    } = addChild;

    if (
      !full_name ||
      !date_of_birth ||
      !gender ||
      !grade ||
      !selectedSchool ||
      !selectedBranch ||
      !pickup_address
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate date of birth
    const dob = new Date(date_of_birth);
    const today = new Date();
    const age = Math.floor(
      (today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    );

    if (isNaN(dob.getTime())) {
      toast.error("Please enter a valid date of birth.");
      return;
    }

    if (
      requires_girls_only &&
      (gender.toLowerCase() !== "female" || age < 10)
    ) {
      toast.error(
        "Girls-only van allows only female children aged 10 or above.",
      );
      return;
    }

    console.log("selectedBranch", selectedBranch);

    const childData = new FormData();
    childData.append("full_name", addChild.full_name);
    childData.append("date_of_birth", addChild.date_of_birth);
    childData.append("gender", addChild.gender);
    childData.append("grade", addChild.grade);
    childData.append("branch_id", selectedBranch.toString());
    childData.append("school_id", selectedSchool.toString());
    childData.append("emergency_contact", addChild.emergency_contact || "");
    childData.append("disease", addChild.disease || "");
    childData.append("pickup_address", addChild.pickup_address || "");
    childData.append(
      "requires_girls_only",
      addChild.requires_girls_only ? "true" : "false",
    );
    childData.append("latitude", addChild.latitude.toString());
    childData.append("longitude", addChild.longitude.toString());
    console.log(childData); // Log the FormData object
    console.log(addChild.child_pic); // Log the FormData object for debugging
    if (addChild.child_pic) {
      childData.append("child_pic", addChild.child_pic);
    }

    addChildren(childData as any, {
      onSuccess: () => {
        setAddChild({
          full_name: "",
          date_of_birth: "",
          gender: "",
          grade: "",
          emergency_contact: "",
          disease: "",
          requires_girls_only: false,
          child_pic: null,
          pickup_address: "",
          latitude: 0,
          longitude: 0,
        });
        // setDisplayedSchoolName("");
        setShowAddModal(false);
        setSelectedSchool("");
        setSelectedBranch("");
        // toast.success("Child added successfully!");
      },
    });
  };

  // Handle edit child functionality
  const handleEditClick = (child: Child) => {
    console.log("Editing child:", child);
    setEditingChild(child);
    setEditChild({
      full_name: child.full_name || "",
      date_of_birth: child.date_of_birth || "",
      gender: child.gender || "",
      grade: child.grade || "",
      school_id:
        typeof child.school_id === "string"
          ? parseInt(child.school_id) || 0
          : child.school_id || 0,
      branch_id:
        typeof child.branch_id === "string"
          ? parseInt(child.branch_id) || 0
          : child.branch_id || 0,
      emergency_contact: child.emergency_contact || "",
      disease: child.disease || "",
      pickup_address: child.pickup_address || "",
      requires_girls_only: child.requires_girls_only || false,
      child_pic: null,
      latitude: child.latitude || 0.0,
      longitude: child.longitude || 0.0,
    });
    // setDisplayedSchoolName(child.school_name || "");
    setShowEditModal(true);
  };

  const handleUpdateChild = () => {
    if (!editingChild) return;

    const { date_of_birth } = editChild;

    // Validate date of birth
    const dob = new Date(date_of_birth);
    // const today = new Date();
    // const age = Math.floor(
    //   (today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    // );

    if (isNaN(dob.getTime())) {
      toast.error("Please enter a valid date of birth.");
      return;
    }
    console.log("editChild", editChild);
    const childData = new FormData();
    childData.append("full_name", editChild.full_name);
    childData.append("date_of_birth", editChild.date_of_birth);
    childData.append("gender", editChild.gender);
    childData.append("grade", editChild.grade);
    childData.append("school_id", editChild.school_id.toString());
    childData.append("branch_id", editChild.branch_id.toString());
    childData.append("emergency_contact", editChild.emergency_contact || "");
    childData.append("pickup_address", editChild.pickup_address || "");
    childData.append("disease", editChild.disease || "");
    childData.append(
      "requires_girls_only",
      editChild.requires_girls_only ? "true" : "false",
    );
    childData.append("latitude", editChild.latitude.toString());
    childData.append("longitude", editChild.longitude.toString());

    if (editChild.child_pic) {
      childData.append("child_pic", editChild.child_pic);
    }

    updateChild({ id: editingChild.id, data: childData } as any, {
      onSuccess: () => {
        setShowEditModal(false);
      },
    });
  };

  const handleDeleteClick = (childId: string | number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this child? This action cannot be undone.",
      )
    ) {
      deleteChild(
        { bookingId: childId },
        {
          onSuccess: () => {
            toast.success("Child deleted successfully!");
          },
          onError: (error: any) => {
            console.error("Error deleting child:", error);
            toast.error("Failed to delete child. Please try again.");
          },
        },
      );
    }
  };

  // Use actual API data instead of mock data
  const children = childrenData || [];

  // Calculate stats efficiently
  const totalChildren = children.length;
  const activeChildren = children.filter(
    (c: Child) => (c.status || "active") === "active",
  ).length;
  const girlsOnlyChildren = children.filter(
    (c: Child) => c.van_requires_girls_only,
  ).length;
  const totalSchools = [
    ...new Set(children.map((child: Child) => child.school_name)),
  ].length;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "Guest"}
        userName={user?.full_name || "Guest"}
        userEmail={user?.email || "guest@example.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header
          title="My Children"
          subtitle="Manage your children's profiles and transportation"
          role={user?.role || "Guest"}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {totalChildren}
                </h3>
                <p className="text-sm text-neutral-600">Total Children</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {activeChildren}
                </h3>
                <p className="text-sm text-neutral-600">Active</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {girlsOnlyChildren}
                </h3>
                <p className="text-sm text-neutral-600">Girls-Only Van</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center">
                    <School className="w-6 h-6 text-secondary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  {totalSchools}
                </h3>
                <p className="text-sm text-neutral-600">Schools</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Child Button */}
          <div className="mb-6">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-5 h-5" />
              Add New Child
            </Button>
          </div>

          {/* Children List */}
          <div className="grid lg:grid-cols-2 gap-6">
            {children.length > 0 ? (
              children.map((child: Child) => (
                <Card key={child.id} hover>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {child.child_pic ? (
                          <Avatar src={getFileUrl(child.child_pic)} size="xl" />
                        ) : (
                          <Avatar name={child.full_name} size="xl" />
                        )}
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {child.full_name}
                            {child.van_requires_girls_only && (
                              <Badge variant="danger" className="text-xs">
                                <Shield className="w-3 h-3" />
                                Girls-Only
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            {new Date().getFullYear() -
                              new Date(child.date_of_birth).getFullYear()}{" "}
                            years old • {child.grade || "N/A"} grade
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={
                          child.status === "active" ? "success" : "secondary"
                        }
                      >
                        {child.status === "active" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {(child.status || "active").charAt(0).toUpperCase() +
                          (child.status || "active").slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* School Info */}
                      <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                        <School className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">
                            School
                          </p>
                          <p className="text-sm text-neutral-600">
                            {child.school_name}
                          </p>
                        </div>
                      </div>

                      {/* Guardian Info */}
                      <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">
                            Guardian
                          </p>
                          <p className="text-sm text-neutral-600">
                            {child.guardian || "Not provided"}
                          </p>
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                        <Phone className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">
                            Emergency Contact
                          </p>
                          <p className="text-sm text-neutral-600">
                            {child.emergency_contact || "Not provided"}
                          </p>
                        </div>
                      </div>

                      {/* Medical Info */}
                      {child.disease && (
                        <div className="flex items-start gap-3 p-3 bg-highlight-50 rounded-lg border border-highlight-200">
                          <AlertCircle className="w-5 h-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900">
                              Medical Information
                            </p>
                            <p className="text-sm text-neutral-700">
                              {child.disease}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Van Assignment */}
                      {child.vanAssigned && (
                        <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900">
                              Assigned Van
                            </p>
                            <p className="text-sm text-neutral-600">
                              {child.vanAssigned} • Driver: {child.driver}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditClick(child)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </Button>

                      <Button
                        variant="outline"
                        className="text-accent hover:bg-accent-50"
                        onClick={() => handleDeleteClick(child.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    No children found
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    You haven't added any children yet. Add a child to get
                    started.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Child
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Add Child Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Add New Child</CardTitle>
                      <CardDescription>
                        Enter your child's information
                      </CardDescription>
                    </div>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent>
                  <form className="space-y-5">
                    {/* Profile Photo Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Child Photo
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center">
                          {addChild.child_pic ? (
                            <img
                              src={URL.createObjectURL(addChild.child_pic)}
                              alt="Child preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-neutral-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            id="child-pic"
                            name="child_pic"
                            accept="image/jpeg, image/png, image/webp, image/jpg"
                            onChange={handleChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="child-pic"
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Choose Photo
                          </label>
                          <p className="text-xs text-neutral-500 mt-1">
                            JPG, PNG, JPEG or WEBP (Max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter child's full name"
                          icon={<User className="w-5 h-5" />}
                          required
                          name="full_name"
                          value={addChild.full_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          icon={<Calendar className="w-5 h-5" />}
                          required
                          name="date_of_birth"
                          value={addChild.date_of_birth}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Gender <span className="text-accent">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          value={addChild.gender}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setAddChild((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Grade <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., 5th Grade"
                          icon={<School className="w-5 h-5" />}
                          name="grade"
                          value={addChild.grade}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* School Info */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Select School *
                        </label>

                        <select
                          value={selectedSchool}
                          onChange={(e) => {
                            setSelectedSchool(e.target.value);
                            setSelectedBranch("");
                          }}
                          className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                          required
                        >
                          <option value="">Choose School</option>

                          {schools.map((school: any) => (
                            <option key={school.id} value={school.id}>
                              {school.school_name} - {school.city}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Branch */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Select Branch *
                        </label>

                        <select
                          value={selectedBranch}
                          onChange={(e) => setSelectedBranch(e.target.value)}
                          className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                          required
                          disabled={!selectedSchool}
                        >
                          <option value="">Choose Branch</option>

                          {selectedSchoolBranches.map((branch: any) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.branch_name} ({branch.address})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Pickup Address <span className="text-red-500">*</span>
                      </label>
                      <ChildAddress
                        pickupAddress={addChild.pickup_address}
                        setPickupAddress={(address: string) =>
                          setAddChild((prev) => ({
                            ...prev,
                            pickup_address: address,
                          }))
                        }
                        setLatitude={(latitude: number) =>
                          setAddChild((prev) => ({
                            ...prev,
                            latitude: latitude,
                          }))
                        }
                        setLongitude={(longitude: number) =>
                          setAddChild((prev) => ({
                            ...prev,
                            longitude: longitude,
                          }))
                        }
                      />
                      {/* <Input
                        type="text"
                        placeholder="e.g 6th road, Rawalpindi "
                        icon={<MapPin className="w-5 h-5" />}
                        required
                        name="pickup_address"
                        value={addChild.pickup_address}
                        onChange={handleChange}
                      /> */}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Emergency Contact (Optional)
                      </label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        icon={<Phone className="w-5 h-5" />}
                        name="emergency_contact"
                        value={addChild.emergency_contact}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Medical Information (Optional)
                      </label>
                      <textarea
                        placeholder="Any allergies, medical conditions, or special needs..."
                        className="w-full px-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                        rows={3}
                        name="disease"
                        value={addChild.disease}
                        onChange={(e) =>
                          setAddChild({ ...addChild, disease: e.target.value })
                        }
                      />
                    </div>

                    {/* <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 w-5 h-5 rounded border-neutral-300 text-accent focus:ring-2 focus:ring-accent/20"
                          name="requires_girls_only"
                          checked={addChild.requires_girls_only}
                          onChange={handleChange}
                        />
                        <div>
                          <p className="text-sm font-medium text-neutral-900 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-accent" />
                            Require Girls-Only Van
                          </p>
                          <p className="text-xs text-neutral-600 mt-1">
                            Mandatory for girls aged 10 and above for enhanced
                            safety
                          </p>
                        </div>
                      </label>
                    </div> */}
                  </form>
                </CardContent>

                <CardFooter>
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleAddChild}
                      disabled={isAddingChild}
                    >
                      {isAddingChild ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Child
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Edit Child Modal */}
          {showEditModal && editingChild && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Edit Child Profile</CardTitle>
                      <CardDescription>
                        Update your child's information
                      </CardDescription>
                    </div>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent>
                  <form className="space-y-5">
                    {/* Profile Photo Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Child Photo
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center">
                          {editChild.child_pic ? (
                            <img
                              src={URL.createObjectURL(editChild.child_pic)}
                              alt="Child preview"
                              className="w-full h-full object-cover"
                            />
                          ) : editingChild.child_pic ? (
                            <img
                              src={getFileUrl(editingChild.child_pic)}
                              alt="Current child photo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-neutral-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            id="edit-child-pic"
                            name="child_pic"
                            accept="image/jpeg, image/png, image/webp, image/jpg"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setEditChild((prev) => ({
                                  ...prev,
                                  child_pic: file,
                                }));
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="edit-child-pic"
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Change Photo
                          </label>
                          <p className="text-xs text-neutral-500 mt-1">
                            JPG, PNG, JPEG or WEBP (Max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter child's full name"
                          icon={<User className="w-5 h-5" />}
                          required
                          name="full_name"
                          value={editChild.full_name}
                          onChange={(e) =>
                            setEditChild((prev) => ({
                              ...prev,
                              full_name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          icon={<Calendar className="w-5 h-5" />}
                          required
                          name="date_of_birth"
                          value={
                            editChild.date_of_birth
                              ? new Date(editChild.date_of_birth)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setEditChild((prev) => ({
                              ...prev,
                              date_of_birth: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Gender <span className="text-accent">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          name="gender"
                          value={editChild.gender}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setEditChild((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Grade <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., 5th Grade"
                          icon={<School className="w-5 h-5" />}
                          name="grade"
                          value={editChild.grade}
                          onChange={(e) =>
                            setEditChild((prev) => ({
                              ...prev,
                              grade: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Gender <span className="text-accent">*</span>
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-lg border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        name="gender"
                        value={editChild.gender || ""}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setEditChild((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    {/* School */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Select School *
                      </label>
                      <select
                        value={editChild.school_id || ""}
                        onChange={(e) => {
                          setEditChild((prev: any) => ({
                            ...prev,
                            school_id: e.target.value,
                          }));
                          // setSelectedSchool(e.target.value);
                        }}
                        className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                        required
                      >
                        <option value="">Choose School</option>
                        {schools.map((school: any) => (
                          <option key={school.id} value={school.id}>
                            {school.school_name} - {school.city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Branch */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Select Branch *
                      </label>
                      <select
                        value={editChild.branch_id || ""}
                        onChange={(e) =>
                          setEditChild((prev: any) => ({
                            ...prev,
                            branch_id: e.target.value,
                          }))
                        }
                        className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                        required
                        disabled={!selectedSchool}
                      >
                        <option value="">Choose Branch</option>
                        {selectedSchoolBranches.map((branch: any) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.branch_name} ({branch.address})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Pickup Address
                      </label>

                      <ChildAddress
                        pickupAddress={editChild.pickup_address}
                        setPickupAddress={(address: string) =>
                          setEditChild((prev) => ({
                            ...prev,
                            pickup_address: address,
                          }))
                        }
                        setLatitude={(latitude: number) =>
                          setEditChild((prev) => ({
                            ...prev,
                            latitude: latitude,
                          }))
                        }
                        setLongitude={(longitude: number) =>
                          setEditChild((prev) => ({
                            ...prev,
                            longitude: longitude,
                          }))
                        }
                      />
                      {/* <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        icon={<Map className="w-5 h-5" />}
                        name="pickup_address"
                        value={editChild.pickup_address}
                        onChange={(e) =>
                          setEditChild((prev) => ({
                            ...prev,
                            pickup_address: e.target.value,
                          }))
                        }
                      /> */}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Emergency Contact
                      </label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        icon={<Phone className="w-5 h-5" />}
                        name="emergency_contact"
                        value={editChild.emergency_contact}
                        onChange={(e) =>
                          setEditChild((prev) => ({
                            ...prev,
                            emergency_contact: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Medical Information
                      </label>
                      <textarea
                        placeholder="Any allergies, medical conditions, or special needs..."
                        className="w-full px-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                        rows={3}
                        name="disease"
                        value={editChild.disease}
                        onChange={(e) =>
                          setEditChild((prev) => ({
                            ...prev,
                            disease: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 w-5 h-5 rounded border-neutral-300 text-accent focus:ring-2 focus:ring-accent/20"
                          name="requires_girls_only"
                          checked={editChild.requires_girls_only}
                          onChange={(e) =>
                            setEditChild((prev) => ({
                              ...prev,
                              requires_girls_only: e.target.checked,
                            }))
                          }
                        />
                        <div>
                          <p className="text-sm font-medium text-neutral-900 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-accent" />
                            Require Girls-Only Van
                          </p>
                          <p className="text-xs text-neutral-600 mt-1">
                            Mandatory for girls aged 10 and above for enhanced
                            safety
                          </p>
                        </div>
                      </label>
                    </div> */}
                  </form>
                </CardContent>

                <CardFooter>
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleUpdateChild}
                      disabled={isUpdatingChild}
                    >
                      {isUpdatingChild ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          Update Child
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
