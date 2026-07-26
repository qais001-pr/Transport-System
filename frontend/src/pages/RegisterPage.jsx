import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Bus,
  ArrowLeft,
  Users,
  Car,
  Shield,
  UserCheck,
  Loader2,
  Siren,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import useRegister from "../hooks/auth/useRegister";
import useGetAllSchools from "../hooks/schools/useGetAllSchools";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [driverDocuments, setDriverDocuments] = useState({
    driver_photo: null,
    driver_license: null,
    id_card: null,
    vehicle_registration: null,
    vehicle_photo: null,
    number_plate: null,
  });
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    schoolName: "",
  });

  const { mutate: register, isPending } = useRegister();
  const hasSubmittedRef = useRef(false);

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const { data: schoolsData, isLoading: isSchoolLoading } = useGetAllSchools();
  const schools = schoolsData || [];
  const selectedSchoolBranches =
    schools.find((s) => s.id === selectedSchool)?.school_branches || [];

  React.useEffect(() => {
    if (!isPending && hasSubmittedRef.current) {
      hasSubmittedRef.current = false;
    }
  }, [isPending]);

  const roles = [
    {
      id: "PARENT",
      title: "Parent",
      description: "Book and track van services for your children",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary-50",
      borderColor: "border-secondary",
    },
    {
      id: "DRIVER",
      title: "Van Driver",
      description: "Manage routes and transport students safely",
      icon: Car,
      color: "text-primary",
      bgColor: "bg-primary-50",
      borderColor: "border-primary",
    },
    {
      id: "SCHOOL",
      title: "School",
      description: "Oversee and manage the drivers and their complaints",
      icon: Shield,
      color: "text-accent",
      bgColor: "bg-accent-50",
      borderColor: "border-accent",
    },
    {
      id: "GUARD",
      title: "School Guard",
      description: "Monitor student pickups and drop-offs",
      icon: UserCheck,
      color: "text-highlight",
      bgColor: "bg-highlight-50",
      borderColor: "border-highlight",
    },
    {
      id: "POLICE",
      title: "Police",
      description:
        "Oversee and approve drivers according to police regulations",
      icon: Siren,
      color: "text-accent",
      bgColor: "bg-accent-50",
      borderColor: "border-accent",
    },
  ];

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: type === "checkbox" ? checked : value,
  //   });
  // };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }
    if (
      file &&
      !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
        file.type,
      )
    ) {
      toast.error("Invalid file type. Only JPG, PNG, or WEBP allowed.");
      return;
    }
    if (file) {
      setProfilePhoto(file);
    }
  };

  const handleDocumentChange = (documentType, e) => {
    const file = e.target.files?.[0];

    if (file && file.size > 5 * 1024 * 1024) {
      toast.error(
        `${documentType
          .replace("_", " ")
          .replace(/\b\w/g, (l) =>
            l.toUpperCase(),
          )} file size exceeds 5MB limit`,
      );
      return;
    }

    if (
      file &&
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
        "application/pdf",
      ].includes(file.type)
    ) {
      toast.error(
        `Invalid file type for ${documentType.replace(
          "_",
          " ",
        )}. Only JPG, JPEG, PNG, WEBP, or PDF allowed.`,
      );
      return;
    }

    if (file) {
      setDriverDocuments((prev) => ({
        ...prev,
        [documentType]: file,
      }));
    }
  };

  console.log("school_id before", selectedBranch);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      hasSubmittedRef.current = false;
      return;
    }

    if (!selectedRole) {
      toast.error("Please select a role");
      hasSubmittedRef.current = false;
      return;
    }

    const payload = new FormData();
    payload.append("full_name", formData.full_name);
    payload.append("phone", formData.phone);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("role", selectedRole);

    if (profilePhoto) {
      payload.append("profile_photo", profilePhoto);
    }

    if (selectedRole?.toUpperCase() === "DRIVER") {
      payload.append("branch_id", selectedBranch);
      console.log("school_id after", selectedBranch);
      Object.keys(driverDocuments).forEach((key) => {
        if (driverDocuments[key]) {
          payload.append(key, driverDocuments[key]);
        }
      });
    }

    if (selectedRole?.toUpperCase() === "GUARD") {
      payload.append("branch_id", selectedBranch);
    }

    if (selectedRole?.toUpperCase() === "SCHOOL") {
      payload.append("schoolName", formData.schoolName);
    }
    // for (let pair of payload.entries()) {
    //   console.log(",.,.,.,.,.,.",pair[0], pair[1]);
    // }

    register(payload, {
      onSuccess: () => {
        hasSubmittedRef.current = false;
      },
      onError: () => {
        hasSubmittedRef.current = false;
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-600 to-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-white hover:text-white/80 transition-colors flex items-center gap-2 z-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <div className="w-full max-w-5xl relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-soft-lg mb-4">
            <Bus className="w-9 h-9 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Your Account
          </h1>
          <p className="text-white/80">
            Join our safe and efficient school transport system
          </p>
        </div>

        <Card className="shadow-soft-lg">
          <CardHeader>
            <CardTitle>Register as a New User</CardTitle>
            <CardDescription>
              Choose your role and fill in your details to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Select Your Role <span className="text-accent">*</span>
                </label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-300 text-left",
                        selectedRole === role.id
                          ? `${role.borderColor} ${role.bgColor} shadow-card`
                          : "border-neutral-200 hover:border-neutral-300 hover:shadow-soft",
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                          role.bgColor,
                        )}
                      >
                        <role.icon className={cn("w-6 h-6", role.color)} />
                      </div>
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {role.title}
                      </h3>
                      <p className="text-xs text-neutral-600">
                        {role.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center">
                    {profilePhoto ? (
                      <img
                        src={URL.createObjectURL(profilePhoto)}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="profile-photo"
                      accept="image/jpeg, image/png, image/webp, image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-photo"
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

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Zaman Ali"
                  autoComplete="name"
                  icon={<User className="w-5 h-5" />}
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  icon={<Mail className="w-5 h-5" />}
                  value={formData.email}
                  autoComplete="email"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  icon={<Phone className="w-5 h-5" />}
                  value={formData.phone}
                  autoComplete="tel"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    icon={<Lock className="w-5 h-5" />}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[42px] text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                icon={<Lock className="w-5 h-5" />}
                value={formData.confirmPassword}
                autoComplete="new-password"
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />

              {selectedRole === "SCHOOL" && (
                <Input
                  label="School Name"
                  type="text"
                  placeholder="Enter your school name"
                  icon={<School className="w-5 h-5" />}
                  value={formData.schoolName}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolName: e.target.value })
                  }
                  required
                />
              )}

              {selectedRole === "GUARD" && (
                <>
                  {/* School */}
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

                        {schools.map((school) => (
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

                        {selectedSchoolBranches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.branch_name} ({branch.address})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Driver Documents - Show only when driver role is selected */}
              {selectedRole === "DRIVER" && (
                <div className="space-y-4 mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Driver Documentation
                  </h3>
                  <p className="text-sm text-blue-600">
                    Please upload the required documents to verify your driver
                    credentials
                  </p>

                  {/* Document Upload Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Driver Photo */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Driver Photo <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="driver-photo"
                          accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                          onChange={(e) =>
                            handleDocumentChange("driver_photo", e)
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor="driver-photo"
                          className="cursor-pointer inline-flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                        >
                          <User className="w-4 h-4 mr-1" />
                          Choose File
                        </label>
                        {driverDocuments.driver_photo && (
                          <span className="text-sm text-green-600 truncate max-w-[120px]">
                            {driverDocuments.driver_photo.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Driver License */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Driver License <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="driver-license"
                          accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                          onChange={(e) =>
                            handleDocumentChange("driver_license", e)
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor="driver-license"
                          className="cursor-pointer inline-flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                        >
                          <User className="w-4 h-4 mr-1" />
                          Choose File
                        </label>
                        {driverDocuments.driver_license && (
                          <span className="text-sm text-green-600 truncate max-w-[120px]">
                            {driverDocuments.driver_license.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ID Card */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        ID Card <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="id-card"
                          accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                          onChange={(e) => handleDocumentChange("id_card", e)}
                          className="hidden"
                        />
                        <label
                          htmlFor="id-card"
                          className="cursor-pointer inline-flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                        >
                          <User className="w-4 h-4 mr-1" />
                          Choose File
                        </label>
                        {driverDocuments.id_card && (
                          <span className="text-sm text-green-600 truncate max-w-[120px]">
                            {driverDocuments.id_card.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Registration */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Vehicle Registration{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="vehicle-docs"
                          accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                          onChange={(e) =>
                            handleDocumentChange("vehicle_registration", e)
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor="vehicle-docs"
                          className="cursor-pointer inline-flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                        >
                          <User className="w-4 h-4 mr-1" />
                          Choose File
                        </label>
                        {driverDocuments.vehicle_registration && (
                          <span className="text-sm text-green-600 truncate max-w-[120px]">
                            {driverDocuments.vehicle_registration.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Photo */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Vehicle Photo <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="vehicle-photo"
                          accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                          onChange={(e) =>
                            handleDocumentChange("vehicle_photo", e)
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor="vehicle-photo"
                          className="cursor-pointer inline-flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                        >
                          <User className="w-4 h-4 mr-1" />
                          Choose File
                        </label>
                        {driverDocuments.vehicle_photo && (
                          <span className="text-sm text-green-600 truncate max-w-[120px]">
                            {driverDocuments.vehicle_photo.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Number Plate */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Number Plate <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="number-plate"
                          accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                          onChange={(e) =>
                            handleDocumentChange("number_plate", e)
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor="number-plate"
                          className="cursor-pointer inline-flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                        >
                          <User className="w-4 h-4 mr-1" />
                          Choose File
                        </label>
                        {driverDocuments.number_plate && (
                          <span className="text-sm text-green-600 truncate max-w-[120px]">
                            {driverDocuments.number_plate.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* School */}
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

                        {schools.map((school) => (
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

                        {selectedSchoolBranches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.branch_name} ({branch.address})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreeTerms: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
                <span className="text-sm text-neutral-700">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500">
                    Or register with
                  </span>
                </div>
              </div> */}

              {/* <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" className="w-full">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div> */}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-600 font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
