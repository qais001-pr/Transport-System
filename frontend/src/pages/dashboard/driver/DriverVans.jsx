import { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Trash2, Edit2, Plus, RefreshCcw, Camera } from "lucide-react";
import useVans from "../../../hooks/drivers/get/useVans";
import useAddVans from "../../../hooks/drivers/post/useAddVans";
import useUpdateVan from "../../../hooks/drivers/put/useUpdateVan";
import useDeleteVan from "../../../hooks/drivers/delete/useDeleteVan";
import userContext from "../../../context/userContext";
import { Header } from "../../../components/dashboard/Header";
import { Sidebar } from "../../../components/dashboard/Sidebar";
import { getFileUrl } from "../../../api/apiConstant";
import { toast } from "react-toastify";

const INITIAL_FORM = {
  number_plate: "",
  capacity: "",
  fare: "",
  gender: "",
};

const genderOptions = ["MIXED", "GIRLS_ONLY", "BOYS_ONLY"];

const DriverVans = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingVanId, setEditingVanId] = useState(null);
  const { user, logOut } = useContext(userContext);
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const { data, isLoading: loadingVans, isError, refetch } = useVans();
  const { mutate: addVan, isPending: addingVan } = useAddVans();
  const { mutate: updateVan, isPending: updatingVan } = useUpdateVan();
  const { mutate: deleteVan, isPending: deletingVan } = useDeleteVan();

  const vans = Array.isArray(data) ? data : data?.vans || data?.data || [];

  const isBusy = loadingVans || addingVan || updatingVan || deletingVan;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    if (
      !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
        file.type,
      )
    ) {
      toast.error("Only JPG, JPEG, PNG, WEBP allowed");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setEditingVanId(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEdit = (van) => {
    setEditingVanId(van.id || van._id || null);

    setFormData({
      number_plate: van.number_plate || "",
      capacity: van.capacity?.toString() || "",
      fare: van.fare?.toString() || "",
      gender: van.gender || "",
    });

    setPreview(van.photo_url || null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = new FormData();
    payload.append("number_plate", formData.number_plate);
    payload.append("capacity", String(formData.capacity));
    payload.append("fare", String(formData.fare));
    payload.append("gender", formData.gender);

    if (fileRef.current?.files?.[0]) {
      payload.append("photo_url", fileRef.current.files[0]);
    }

    if (editingVanId) {
      updateVan(
        { vanId: editingVanId, data: payload },
        { onSuccess: resetForm },
      );
    } else {
      addVan(payload, { onSuccess: resetForm });
    }
  };

  const handleDelete = (vanId) => {
    if (!vanId) return;
    deleteVan(vanId);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        userRole={user?.role || "Guest"}
        userName={user?.full_name || "Zaman Ali"}
        userEmail={user?.email || "zaman.ali@example.com"}
        logOut={logOut}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="My Vans"
          subtitle="Manage your vans and keep the vehicle information up to date."
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="flex-1 px-4 py-4 sm:px-6 lg:px-0 overflow-x-hidden">
          <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 w-full">
              <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                      Driver Vans
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                      Manage your van fleet and keep the vehicle information up
                      to date.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    {/* <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => refetch()}
                      disabled={loadingVans}
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetForm}
                      disabled={isBusy}
                    >
                      Clear Form
                    </Button>
                  </div>
                </div>

                <form
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
                  onSubmit={handleSubmit}
                >
                  <div className="flex items-center justify-center">
                    <div
                      onClick={() => fileRef.current.click()}
                      className="relative cursor-pointer group"
                    >
                      {/* Circle */}
                      <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-neutral-300 bg-neutral-100 flex items-center justify-center">
                        {preview ? (
                          <img
                            src={preview}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-neutral-500">
                            Upload
                          </span>
                        )}
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Camera className="text-white w-6 h-6" />
                      </div>

                      {/* Hidden input */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <Input
                    label="Number Plate"
                    name="number_plate"
                    value={formData.number_plate}
                    onChange={handleChange}
                    placeholder="ABC-1234"
                    className="lg:col-span-2"
                    required
                  />
                  <Input
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="20"
                    className="lg:col-span-1"
                    required
                    min={1}
                  />
                  <Input
                    label="Fare"
                    name="fare"
                    type="number"
                    value={formData.fare}
                    onChange={handleChange}
                    placeholder="120"
                    className="lg:col-span-1"
                    required
                    min={0}
                  />
                  <div className="flex flex-col gap-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-neutral-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="input h-13"
                      required
                    >
                      <option value="">Select gender</option>
                      {genderOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 lg:col-span-3">
                    <Button type="submit" disabled={isBusy}>
                      <Plus className="mr-2 h-4 w-4" />
                      {editingVanId ? "Update Van" : "Add Van"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isBusy}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="lg:col-span-2 text-sm text-slate-500">
                    {editingVanId
                      ? "Editing an existing van. Submit to update details."
                      : "Fill in all van fields and submit to add a new van."}
                  </div>
                </form>
              </div>

              <Card className="overflow-hidden">
                <CardHeader className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Vans overview</CardTitle>
                    <CardDescription>
                      {vans.length > 0
                        ? `Showing ${vans.length} van${vans.length > 1 ? "s" : ""}`
                        : "No vans available yet."}
                    </CardDescription>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={loadingVans}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Refresh list
                  </Button>
                </CardHeader>

                <CardContent className="bg-slate-50 p-6">
                  {loadingVans ? (
                    <div className="flex min-h-[220px] items-center justify-center">
                      <div className="flex flex-col items-center gap-3 text-slate-600">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p>Loading vans...</p>
                      </div>
                    </div>
                  ) : isError ? (
                    <div className="flex min-h-[220px] items-center justify-center text-center text-slate-700">
                      <div>
                        <p className="text-lg font-medium">
                          Unable to load vans.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Please refresh or check your connection.
                        </p>
                      </div>
                    </div>
                  ) : vans.length === 0 ? (
                    <div className="flex min-h-[220px] items-center justify-center text-slate-600">
                      No vans have been added yet.
                    </div>
                  ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                      {vans.map((van) => {
                        const vanId = van.id || van._id;
                        return (
                          <div
                            key={vanId || van.number_plate}
                            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                          >
                            <div className="relative w-full aspect-[16/10] bg-slate-100">
                              <img
                                src={
                                  getFileUrl(van.photo_url) ||
                                  "https://via.placeholder.com/640x400?text=Van+Image"
                                }
                                alt={`Van ${van.number_plate || "#"}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="p-5">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                                    Number plate
                                  </p>
                                  <p className="mt-1 text-lg font-semibold text-slate-900">
                                    {van.number_plate || "N/A"}
                                  </p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
                                  {van.gender_type || "Any"}
                                </span>
                              </div>

                              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                                <div>
                                  <p className="font-medium text-slate-800">
                                    Capacity
                                  </p>
                                  <p>{van.capacity ?? "—"}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">
                                    Fare
                                  </p>
                                  <p>₨{van.fare ?? "—"}</p>
                                </div>
                              </div>

                              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(van)}
                                >
                                  <Edit2 className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(vanId)}
                                  disabled={deletingVan}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverVans;
