import { useContext, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  MapPin,
  Phone,
  Mail,
  Users,
  Building,
  X,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useSchoolBranches from "../../../hooks/schools/get/useSchoolBranches";
//@ts-ignore
import useAddSchoolBranch from "../../../hooks/schools/post/useAddSchoolBranch";
//@ts-ignore
import useUpdateBranch from "../../../hooks/schools/put/useUpdateBranch";
//@ts-ignore
import useDeleteBranch from "../../../hooks/schools/delete/useDeleteBranch";
//@ts-ignore
import BranchesAddress from "../../../map/BranchesAddress";
import { toast } from "react-toastify";

const SchoolBranches = () => {
  const { user, logOut }: any = useContext(userContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedUpdateBranch, setSelectedUpdateBranch] = useState<any>(null);
  const [selectedDeleteBranch, setSelectedDeleteBranch] = useState<any>(null);
  const [formData, setFormData] = useState({
    branch_name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    start_time: "",
    end_time: "",
    contact_number: "",
  });

  const { data, isLoading, isError } = useSchoolBranches();

  const { mutate: addBranch, isPending: isAdding } = useAddSchoolBranch();
  const { mutate: updateBranch } = useUpdateBranch();
  const { mutate: deleteBranch } = useDeleteBranch();

  const branches =
    data?.flatMap((school: any) =>
      (school.school_branches || []).map((branch: any) => ({
        id: branch?.id,
        name: branch?.branch_name || "",
        address: branch?.address || "",
        phone: branch?.contact_number || 0,
        email: school?.email || "",
        principal: school?.full_name || "",
        studentCount: school?.total_students || 0,
        status: branch?.is_active ? "active" : "inactive",
        latitude: branch?.latitude || 0,
        longitude: branch?.longitude || 0,
        schoolId: school?.id || 0,
        start_time: branch?.start_time || "",
        end_time: branch?.end_time || "",
      })),
    ) || [];

  const totalStudents = branches.reduce(
    (sum: number, b: any) => sum + parseInt(b.studentCount) || 0,
    0,
  );

  const filteredBranches = branches.filter(
    (branch: any) =>
      (branch.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branch.address || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const handleAddBranch = () => {
    setFormData({
      branch_name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      start_time: "",
      end_time: "",
      contact_number: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditBranch = (branch: any) => {
    console.log(branch);
    setFormData({
      branch_name: branch.name || "",
      address: branch.address || "",
      latitude: branch.latitude || 0,
      longitude: branch.longitude || 0,
      start_time: branch.start_time || "",
      end_time: branch.end_time || "",
      contact_number: branch.phone || 0,
    });

    setEditingId(branch.id);
    setShowForm(true);
  };

  const handleSaveBranch = () => {
    if (!formData.branch_name || !formData.address) {
      alert("Please fill required fields");
      return;
    }

    if (editingId) {
      setSelectedUpdateBranch(editingId);
      updateBranch(
        {
          branchId: editingId,
          branchData: {
            branch_name: formData.branch_name,
            address: formData.address,
            contact_number: formData.contact_number,
            latitude: formData.latitude,
            longitude: formData.longitude,
            start_time: formData.start_time,
            end_time: formData.end_time,
          },
        },
        {
          onSettled: () => setSelectedUpdateBranch(null),
        },
      );
    } else {
      const {
        branch_name,
        address,
        latitude,
        longitude,
        start_time,
        end_time,
        contact_number,
      } = formData;
      if (
        !branch_name ||
        !address ||
        !latitude ||
        !longitude ||
        !start_time ||
        !end_time ||
        !contact_number
      ) {
        toast.error("Please fill all required fields");
        return;
      }
      addBranch({
        branch_name: formData.branch_name,
        address: formData.address,
        contact_number: formData.contact_number,
        latitude: formData.latitude,
        longitude: formData.longitude,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });
    }

    setShowForm(false);
  };

  const handleDeleteBranch = (id: number) => {
    setSelectedDeleteBranch(id);
    if (window.confirm("Are you sure you want to delete this branch?")) {
      deleteBranch(
        { branchId: id },
        { onSettled: () => setSelectedDeleteBranch(null) },
      );
    }
  };

  const isEditMode = editingId !== null;
  const isUpdating = selectedUpdateBranch !== null;
  const isBranchLoading = isAdding || isUpdating;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "school"}
        userName={user?.full_name || "School Admin"}
        userEmail={user?.email || "admin@school.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header
          title="SCHOOL BRANCHES"
          subtitle={`Manage all school branches and locations (${branches.length} branches)`}
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Total Branches
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {branches.length}
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {totalStudents}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Active Branches
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {
                        branches.filter((b: any) => b.status === "active")
                          .length
                      }
                    </p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Add Button */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      placeholder="Search branc by name or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={handleAddBranch}
                  className="whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Branch
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Branches Table/List */}
          <div className="space-y-4">
            {isLoading && <div>Loading...</div>}
            {isError && (
              <div className="text-red-500">Failed to load branches</div>
            )}
            {filteredBranches?.school_branches !==null ? (
              filteredBranches.map((branch: any) => (
                <Card
                  key={branch.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Side */}
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                              {branch.name}
                            </h3>
                            <Badge
                              variant="success"
                              className="text-xs capitalize"
                            >
                              {branch.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                            <span className="text-neutral-700">
                              {branch.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="text-neutral-700">
                              {branch.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="text-neutral-700">
                              {branch.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-primary-50 rounded-lg">
                            <p className="text-xs text-neutral-600 mb-1">
                              Principal
                            </p>
                            <p className="font-semibold text-neutral-900 text-sm">
                              {branch.principal}
                            </p>
                          </div>
                          <div className="p-3 bg-secondary-50 rounded-lg">
                            <p className="text-xs text-neutral-600 mb-1">
                              Students
                            </p>
                            <p className="font-semibold text-neutral-900 text-sm">
                              {branch.studentCount}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBranch(branch)}
                            className="flex-1 sm:flex-none"
                            disabled={selectedUpdateBranch === branch.id}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            {selectedUpdateBranch === branch.id
                              ? "Updating..."
                              : "Edit"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBranch(branch.id)}
                            className="flex-1 sm:flex-none text-red-600 hover:bg-red-50"
                            disabled={selectedDeleteBranch === branch.id}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {selectedDeleteBranch === branch.id
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No branches found
                  </h3>
                  <p className="text-neutral-600">
                    {searchTerm
                      ? "Try adjusting your search criteria."
                      : "Add your first school branch to get started."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Add/Edit Modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
              {/* Modal Container */}
              <Card className="w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col rounded-2xl">
                {/* Header */}
                <CardHeader className="flex flex-row items-center justify-between border-b px-4 sm:px-6 py-3">
                  <CardTitle className="text-base sm:text-lg">
                    {editingId ? "Edit Branch" : "Add Branch"}
                  </CardTitle>

                  <button
                    onClick={() => setShowForm(false)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </CardHeader>

                {/* Scrollable Content */}
                <CardContent className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                  {/* Branch Name */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Branch Name *
                    </label>
                    <Input
                      value={formData.branch_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branch_name: e.target.value,
                        })
                      }
                      placeholder="e.g., Lincoln Elementary"
                    />
                  </div>

                  {/* Address + Map */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Address *
                    </label>

                    <div className="w-full h-[250px] sm:h-[300px] rounded-lg overflow-hidden border">
                      <BranchesAddress
                        pickupAddress={formData.address}
                        setPickupAddress={(addr: any) =>
                          setFormData((prev) => ({ ...prev, address: addr }))
                        }
                        setLatitude={(lat: any) =>
                          setFormData((prev) => ({ ...prev, latitude: lat }))
                        }
                        setLongitude={(lng: any) =>
                          setFormData((prev) => ({ ...prev, longitude: lng }))
                        }
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone
                    </label>
                    <Input
                      value={formData.contact_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_number: e.target.value,
                        })
                      }
                      placeholder="e.g., 3001234567"
                    />
                  </div>

                  {/* Time Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Start Time *
                      </label>
                      <Input
                        type="time"
                        value={formData.start_time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            start_time: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        End Time *
                      </label>
                      <Input
                        type="time"
                        value={formData.end_time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            end_time: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>

                {/* Footer Buttons */}
                <div className="border-t px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSaveBranch}
                    className="w-full"
                    disabled={isBranchLoading}
                  >
                    {isBranchLoading
                      ? isEditMode
                        ? "Updating..."
                        : "Adding..."
                      : isEditMode
                        ? "Update Branch"
                        : "Add Branch"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SchoolBranches;
