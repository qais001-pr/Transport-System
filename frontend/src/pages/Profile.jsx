import { useContext, useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Edit3,
  Save,
  X,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import userContext from "../context/userContext";
import { getFileUrl } from "../api/apiConstant";
import { toast } from "react-toastify";
import useEditProfile from "../hooks/users/put/useEditProfile";

export const Profile = () => {
  const { user, updateUserProfile } = useContext(userContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { mutate: updateUserProfileMutation, isPending } = useEditProfile();

  useEffect(() => {
    if (user) {
      setEditedData({
        full_name: user.full_name || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
      });
    }
  }, [user]);
  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Append all text fields
      Object.keys(editedData).forEach((key) => {
        if (editedData[key] !== null && editedData[key] !== undefined) {
          formData.append(key, editedData[key]);
        }
      });

      if (profilePhoto) {
        formData.append("profile_photo", profilePhoto);
      }

      if (updateUserProfileMutation) {
        console.log("form data", formData);
        updateUserProfileMutation(formData, {
          onSuccess: (updatedUser) => {
            if (updateUserProfile) updateUserProfile(updatedUser);
            setIsEditing(false);
            setProfilePhoto(null);
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
            }
          },
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      full_name: user?.full_name || user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
    });
    setProfilePhoto(null);
    setPreviewUrl(null);
    // Revoke the preview URL to free memory
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      {/* Profile Header */}
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary h-32"></div>
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Profile Image */}
              <div className="relative">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.profile_photo ? (
                    <>
                      <img
                        src={getFileUrl(user.profile_photo)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image failed to load:", e.target.src);
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                        <User className="w-12 h-12 text-gray-500" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer shadow-md hover:bg-primary-600 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp, image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* User Info */}
              <div className="pb-4 sm:pb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={editedData.full_name}
                      onChange={handleInputChange}
                      className="border-b border-gray-300 focus:border-primary focus:outline-none bg-transparent font-bold text-2xl sm:text-3xl"
                    />
                  ) : (
                    user?.full_name || user?.name || "User Name"
                  )}
                </h1>
                <p className="text-gray-600 capitalize">
                  {user?.role || "User Role"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    className="flex items-center gap-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Save className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEditClick}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="full_name"
                      value={editedData.full_name}
                      onChange={handleInputChange}
                      icon={<User className="w-5 h-5" />}
                    />
                  ) : (
                    <p className="text-gray-900">
                      {user?.full_name || user?.name || "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      name="email"
                      value={editedData.email}
                      onChange={handleInputChange}
                      icon={<Mail className="w-5 h-5" />}
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      name="phone"
                      value={editedData.phone}
                      onChange={handleInputChange}
                      icon={<Phone className="w-5 h-5" />}
                    />
                  ) : (
                    <p className="text-gray-900">{user?.phone || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
              </div>

              <div>
                {isEditing && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Input
                      type="text"
                      name="password"
                      value={editedData.password}
                      onChange={handleInputChange}
                      icon={<KeyRound className="w-5 h-5" />}
                    />
                  </>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="address"
                    value={editedData.address}
                    onChange={handleInputChange}
                    icon={<MapPin className="w-5 h-5" />}
                  />
                ) : (
                  <p className="text-gray-900">{user?.address || "-"}</p>
                )}
              </div> */}

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editedData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900">
                    {user?.bio || "No bio provided"}
                  </p>
                )}
              </div> */}
            </CardContent>
          </Card>

          {/* Account Security */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-500">
                      Last updated recently
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-gray-500">
                      Add extra security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Set Up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="font-medium text-green-600">
                    {user?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className="font-medium capitalize">
                    {user?.role || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Login</span>
                  <span className="font-medium">
                    {user?.last_login
                      ? new Date(user.last_login).toLocaleString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Updated profile information</p>
                    <p className="text-xs text-gray-500">Today, 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Changed password</p>
                    <p className="text-xs text-gray-500">Yesterday, 2:45 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Logged in from new device</p>
                    <p className="text-xs text-gray-500">Jan 15, 2026</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Notifications */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email notifications</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="email_notifications"
                      id="email_notifications"
                      className="sr-only"
                    />
                    <label
                      htmlFor="email_notifications"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white transform translate-x-0 transition-transform ease-in-out duration-200"></span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS alerts</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="sms_alerts"
                      id="sms_alerts"
                      className="sr-only"
                    />
                    <label
                      htmlFor="sms_alerts"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white transform translate-x-0 transition-transform ease-in-out duration-200"></span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push notifications</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="push_notifications"
                      id="push_notifications"
                      className="sr-only"
                    />
                    <label
                      htmlFor="push_notifications"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-haspopup"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white transform translate-x-0 transition-transform ease-in-out duration-200"></span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
