import { useState, useContext } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  MapPin,
  DollarSign,
  Star,
  Shield,
  SlidersHorizontal,
  User,
  Loader2,
  XCircle,
  Check,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
//@ts-ignore
import useVans from "../../../hooks/parents/get/useVans";
//@ts-ignore
import { getFileUrl } from "../../../api/apiConstant";
//@ts-ignore
import { useChildren } from "../../../hooks/parents/get/useChildren";
//@ts-ignore
import useBookVan from "../../../hooks/parents/useBookVan";
//@ts-ignore
import { Avatar } from "@/components/ui/Avatar";
//@ts-ignore
import { toast } from "react-toastify";
//@ts-ignore
import userContext from "../../../context/userContext";

interface Van {
  id: number;
  number_plate: string;
  driver_name: string;
  average_rating: number;
  total_reviews: number;
  fare: number;
  capacity: number;
  available_seats: number;
  gender_type: string;
  is_active: boolean;
  driver_id: number;
  photo_url?: string;
  driver_profile_photo?: string;
  amenities?: string[];
  driver_contact?: string;
  driver_email?: string;
}

export default function ParentVans() {
  const [showFilters, setShowFilters] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [selectedChildren, setSelectedChildren] = useState<number[]>([]);
  const [selectedVanDetail, setSelectedVanDetail] = useState<Van | null>(null);
  const { user, logOut }: any = useContext(userContext);

  const [filters, setFilters] = useState({
    location: "",
    maxPrice: 50000,
    minRating: 0,
    girlsOnly: false,
    availableSeats: 1,
  });

  const { data, isLoading, isError } = useVans();
  const { data: childrenData, isLoading: childrenLoading } = useChildren();
  const { mutate: bookVan, isPending: isBooking } = useBookVan();
  const vans = data?.vans || [];
  const children = childrenData || [];

  const filteredVans = vans.filter((van: Van) => {
    const matchesLocation =
      !filters.location ||
      van.driver_name?.toLowerCase().includes(filters.location.toLowerCase()) ||
      van.number_plate?.toLowerCase().includes(filters.location.toLowerCase());

    const matchesPrice = (van.fare || 0) <= filters.maxPrice;

    const matchesRating =
      !filters.minRating || (van.average_rating || 0) >= filters.minRating;

    const matchesSeats = (van.available_seats || 0) >= filters.availableSeats;

    const matchesGirlsOnly =
      !filters.girlsOnly || van.gender_type === "GIRLS_ONLY";

    return (
      matchesLocation &&
      matchesPrice &&
      matchesRating &&
      matchesSeats &&
      matchesGirlsOnly
    );
  });

  // Handle van detail functionality
  const handleViewDetails = (vanId: number) => {
    const van = vans.find((v: Van) => v.id === vanId) as Van | null;
    if (van) {
      setSelectedVanDetail(van);
      setShowDetailModal(true);
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedVanDetail(null);
  };

  const handleBookClick = (van: Van) => {
    setSelectedVan(van);
    setSelectedChildren([]);
    setShowBookingModal(true);
  };

  const toggleChildSelection = (childId: number) => {
    setSelectedChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId],
    );
  };

  const handleConfirmBooking = () => {
    if (!selectedVan || selectedChildren.length === 0) {
      toast.error("Please select at least one child to book");
      return;
    }

    // const bookingData = {
    //   vanId: selectedVan.id,
    //   childrenIds: selectedChildren,
    // };

    bookVan(
      { vanId: selectedVan.id, childrenIds: selectedChildren },
      {
        onSuccess: () => {
          setShowBookingModal(false);
          setSelectedVan(null);
          setSelectedChildren([]);
          // toast.success("Booking request submitted successfully!");
        },
        onError: (error: any) => {
          console.error("Booking error:", error);
          toast.error("Failed to book van. Please try again.");
        },
      },
    );
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedVan(null);
    setSelectedChildren([]);
  };

  const totalVans = vans.length;
  const avgRating =
    totalVans > 0
      ? (
          vans.reduce(
            (sum: number, van: Van) => sum + (van.average_rating || 0),
            0,
          ) / totalVans
        ).toFixed(1)
      : 0;
  const avgPrice =
    totalVans > 0
      ? Math.round(
          vans.reduce((sum: number, van: Van) => sum + (van.fare || 0), 0) /
            totalVans,
        )
      : 0;
  const girlsOnlyCount = vans.filter(
    (van: Van) => van.gender_type === "GIRLS_ONLY",
  ).length;

  const noMatchDueToPrice =
    filteredVans.length === 0 &&
    vans.some((v: Van) => (v.fare || 0) > filters.maxPrice);

  const minAvailablePrice =
    vans.length > 0
      ? Math.min(...vans.map((v: Van) => v.fare || Infinity))
      : null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar
          userRole="parent"
          userName="Sarah Johnson"
          userEmail="sarah.j@email.com"
          logOut={() => {}}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading vans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar
          userRole="parent"
          userName="Sarah Johnson"
          userEmail="sarah.j@email.com"
          logOut={() => {}}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-neutral-600">
              Failed to load vans. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          title="Find Vans"
          subtitle="Search and book the perfect van for your children"
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Search and Filter Bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by location, school, or driver name..."
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:w-auto"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                  {(filters.girlsOnly || filters.minRating > 0) && (
                    <Badge variant="primary" className="ml-2">
                      Active
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-neutral-200 animate-slide-down">
                  <p className="text-neutral-600 mb-4">
                    {noMatchDueToPrice
                      ? `No vans available under Rs.${filters.maxPrice}. Minimum available price is Rs.${minAvailablePrice}.`
                      : "Try adjusting your filters or search criteria"}
                  </p>

                  {noMatchDueToPrice && (
                    <Button
                      variant="primary"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          maxPrice: minAvailablePrice || prev.maxPrice,
                        }))
                      }
                    >
                      Adjust to Minimum Price (Rs.{minAvailablePrice})
                    </Button>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Max Price */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Max Monthly Fee: Rs.{filters.maxPrice}
                      </label>
                      <input
                        type="range"
                        min="1000"
                        max="50000"
                        step="10"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxPrice: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Min Rating */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Minimum Rating: {filters.minRating || "Any"}
                      </label>
                      <select
                        value={filters.minRating}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minRating: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border-2 border-neutral-300 focus:border-primary focus:outline-none"
                      >
                        <option value="0">Any Rating</option>
                        <option value="4.0">4.0+</option>
                        <option value="4.5">4.5+</option>
                        <option value="4.8">4.8+</option>
                      </select>
                    </div>

                    {/* Available Seats */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Required Seats: {filters.availableSeats}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={filters.availableSeats}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            availableSeats: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border-2 border-neutral-300 focus:border-primary focus:outline-none"
                      />
                    </div>

                    {/* Girls Only */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Van Type
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={filters.girlsOnly}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              girlsOnly: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">
                            Girls Only
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-neutral-600">
                      Showing {filteredVans.length} of {vans.length} vans
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFilters({
                          location: "",
                          maxPrice: 50000,
                          minRating: 0,
                          girlsOnly: false,
                          availableSeats: 1,
                        })
                      }
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card hover>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {totalVans}
                </p>
                <p className="text-xs text-neutral-600">Available Vans</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {avgRating}
                </p>
                <p className="text-xs text-neutral-600">Avg Rating</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-highlight-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-5 h-5 text-highlight" />
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  Rs. {avgPrice}
                </p>
                <p className="text-xs text-neutral-600">Avg Price</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {girlsOnlyCount}
                </p>
                <p className="text-xs text-neutral-600">Girls Only</p>
              </CardContent>
            </Card>
          </div>

          {/* Van Cards Grid */}
          {filteredVans.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVans?.map((van: Van, index: number) => (
                <Card key={index} hover className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className="p-0 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 mb-1">
                            Van #{van.number_plate || "N/A"}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {van.driver_name}
                          </p>
                        </div>
                        <Badge
                          variant={
                            (van.available_seats || 0) > 0
                              ? "success"
                              : "danger"
                          }
                        >
                          {(van.available_seats || 0) > 0
                            ? `${van.available_seats} seats`
                            : "Full"}
                        </Badge>
                      </div>

                      {/* Rating and Distance */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-highlight text-highlight" />
                          <span className="text-sm font-semibold text-neutral-900">
                            {van.average_rating || 0}
                          </span>
                          <span className="text-xs text-neutral-600">
                            ({van.total_reviews || 0} review
                            {van.total_reviews !== 1 ? "s" : ""})
                          </span>
                        </div>
                        {/* <div className="flex items-center gap-1 text-sm text-neutral-600">
                          <MapPin className="w-4 h-4" />
                          {van.distance}
                        </div> */}
                      </div>
                    </div>

                    {/* Image */}
                    <div className="h-48 relative">
                      {van.photo_url || van.driver_profile_photo ? (
                        <img
                          src={
                            getFileUrl(
                              van.photo_url || van.driver_profile_photo,
                            ) ||
                            "https://thumbs.dreamstime.com/b/blank-male-avatar-profile-pic-simple-black-silhouette-empty-social-media-user-display-generic-business-template-suitable-347210833.jpg"
                          }
                          alt={`${van.number_plate} van`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallbackElement = document.getElementById(
                              `fallback-${index}`,
                            );
                            if (fallbackElement) {
                              fallbackElement.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <div
                        id={`fallback-${index}`}
                        className={`absolute inset-0 flex items-center justify-center ${
                          van.photo_url || van.driver_profile_photo
                            ? "hidden"
                            : "bg-gradient-to-br from-primary to-secondary"
                        }`}
                      >
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {van.number_plate.slice(-3)}
                          </span>
                        </div>
                      </div>
                      {van.gender_type === "GIRLS_ONLY" && (
                        <div className="absolute top-4 right-4">
                          <Badge
                            variant="danger"
                            className="bg-white/90 text-accent"
                          >
                            <Shield className="w-3 h-3" />
                            Girls Only
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-0 pt-6">
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-neutral-600">
                            Gender Type:
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {van?.gender_type || "Mixed"}
                          </Badge>
                        </div>
                      </div>
                      {/* Amenities */}
                      {/* <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {van.amenities && Array.isArray(van.amenities) ? (
                            van.amenities.map(
                              (amenity: string, idx: number) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {amenity}
                                </Badge>
                              ),
                            )
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              No amenities listed
                            </Badge>
                          )}
                        </div>
                      </div> */}

                      {/* Seats Info */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-neutral-600">Capacity</span>
                          <span className="font-semibold text-neutral-900">
                            {van.capacity} total seats
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-neutral-900">
                            Rs.{van.fare || "N/A"}
                          </span>
                          <span className="text-sm text-neutral-600">
                            /month
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewDetails(van.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="primary"
                          className="flex-1"
                          disabled={(van.capacity || 0) === 0}
                          onClick={() => handleBookClick(van)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No vans found
                </h3>
                <p className="text-neutral-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  variant="primary"
                  onClick={() =>
                    setFilters({
                      location: "",
                      maxPrice: 200,
                      minRating: 0,
                      girlsOnly: false,
                      availableSeats: 1,
                    })
                  }
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Booking Modal */}
          {showBookingModal && selectedVan && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Book Van for Your Children</CardTitle>
                      <CardDescription>
                        Select which children you want to book this van for
                      </CardDescription>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Van Information */}
                  <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      Van Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Van Number:</span>
                        <span className="font-medium ml-2">
                          #{selectedVan.number_plate}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Driver:</span>
                        <span className="font-medium ml-2">
                          {selectedVan.driver_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Monthly Fee:</span>
                        <span className="font-medium ml-2">
                          Rs.{selectedVan.fare}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-600">
                          Available Seats:
                        </span>
                        <span className="font-medium ml-2">
                          {selectedVan.available_seats}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Children Selection */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-neutral-900 mb-4">
                      Select Children ({selectedChildren.length} selected)
                    </h3>

                    {childrenLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-neutral-600">
                          Loading children...
                        </p>
                      </div>
                    ) : children.length > 0 ? (
                      <div className="space-y-3">
                        {children.map((child: any) => (
                          <div
                            key={child.id}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              selectedChildren.includes(child.id)
                                ? "border-primary bg-primary-50"
                                : "border-neutral-200 hover:border-neutral-300"
                            }`}
                            onClick={() => toggleChildSelection(child.id)}
                          >
                            <div className="relative">
                              {child.child_pic ? (
                                <Avatar
                                  src={getFileUrl(child.child_pic)}
                                  size="lg"
                                />
                              ) : (
                                <Avatar name={child.full_name} size="lg" />
                              )}
                              {selectedChildren.includes(child.id) && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <h4 className="font-medium text-neutral-900">
                                {child.full_name}
                              </h4>
                              <p className="text-sm text-neutral-600">
                                {child.grade} • {child.school_name}
                              </p>
                              {child.requires_girls_only && (
                                <Badge
                                  variant="danger"
                                  className="mt-1 text-xs"
                                >
                                  <Shield className="w-3 h-3" />
                                  Girls-Only Required
                                </Badge>
                              )}
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedChildren.includes(child.id)
                                  ? "border-primary bg-primary"
                                  : "border-neutral-300"
                              }`}
                            >
                              {selectedChildren.includes(child.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                          No children found
                        </h3>
                        <p className="text-neutral-600">
                          You haven't added any children yet. Please add
                          children to your profile first.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Selected Children Summary */}
                  {selectedChildren.length > 0 && (
                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">
                        Selected Children ({selectedChildren.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedChildren.map((childId) => {
                          const child = children.find(
                            (c: any) => c.id === childId,
                          );
                          return child ? (
                            <Badge
                              key={childId}
                              variant="success"
                              className="text-sm"
                            >
                              {child.full_name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={handleCloseModal}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleConfirmBooking}
                      disabled={selectedChildren.length === 0 || isBooking}
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Booking...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Confirm Booking ({selectedChildren.length})
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Van Detail Modal */}
          {showDetailModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Van Details</CardTitle>
                      <CardDescription>
                        Complete information about this van service
                      </CardDescription>
                    </div>
                    <button
                      onClick={handleCloseDetailModal}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent>
                  {selectedVanDetail ? (
                    <div className="space-y-6">
                      {/* Van Header */}
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-neutral-900">
                              Van #{selectedVanDetail.number_plate || "N/A"}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              {selectedVanDetail.driver_name ||
                                "Unknown Driver"}
                            </p>
                          </div>
                          <Badge
                            variant={
                              selectedVanDetail.gender_type === "GIRLS_ONLY"
                                ? "danger"
                                : "success"
                            }
                          >
                            {selectedVanDetail.gender_type === "GIRLS_ONLY" ? (
                              <>
                                <Shield className="w-3 h-3 mr-1" />
                                Girls Only
                              </>
                            ) : (
                              "Mixed Gender"
                            )}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Driver Information */}
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              Driver Information
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                {selectedVanDetail.driver_profile_photo ? (
                                  <Avatar
                                    src={getFileUrl(
                                      selectedVanDetail.driver_profile_photo,
                                    )}
                                    size="md"
                                  />
                                ) : (
                                  <Avatar
                                    name={
                                      selectedVanDetail.driver_name || "Driver"
                                    }
                                    size="md"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">
                                    {selectedVanDetail.driver_name || "N/A"}
                                  </p>
                                  <p className="text-sm text-neutral-600">
                                    Professional Driver
                                  </p>
                                </div>
                              </div>
                              {selectedVanDetail.driver_contact && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-neutral-500" />
                                  <span>
                                    {selectedVanDetail.driver_contact}
                                  </span>
                                </div>
                              )}
                              {selectedVanDetail.driver_email && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4 text-neutral-500" />
                                  <span>{selectedVanDetail.driver_email}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Van Information */}
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                              <Shield className="w-4 h-4 mr-2" />
                              Van Information
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-neutral-600">
                                  Van Number
                                </span>
                                <span className="text-sm font-medium">
                                  #{selectedVanDetail.number_plate || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-neutral-600">
                                  Capacity
                                </span>
                                <span className="text-sm font-medium">
                                  {selectedVanDetail.capacity || 0} seats
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-neutral-600">
                                  Available Seats
                                </span>
                                <span className="text-sm font-medium">
                                  {selectedVanDetail.available_seats || 0} seats
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-neutral-600">
                                  Monthly Fee
                                </span>
                                <span className="text-sm font-medium">
                                  Rs.{selectedVanDetail.fare || "N/A"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Rating and Reviews */}
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                              <Star className="w-4 h-4 mr-2" />
                              Rating & Reviews
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <Star className="w-5 h-5 fill-highlight text-highlight" />
                                  <span className="text-lg font-bold ml-1">
                                    {selectedVanDetail.average_rating?.toFixed(
                                      1,
                                    ) || "0.0"}
                                  </span>
                                </div>
                                <span className="text-sm text-neutral-600">
                                  ({selectedVanDetail.total_reviews || 0}{" "}
                                  reviews)
                                </span>
                              </div>
                              <div className="w-full bg-neutral-200 rounded-full h-2">
                                <div
                                  className="bg-highlight h-2 rounded-full"
                                  style={{
                                    width: `${
                                      (selectedVanDetail.average_rating || 0) *
                                      20
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Amenities */}
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Amenities
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedVanDetail.amenities &&
                              Array.isArray(selectedVanDetail.amenities) &&
                              selectedVanDetail.amenities.length > 0 ? (
                                selectedVanDetail.amenities.map(
                                  (amenity: string, idx: number) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {amenity}
                                    </Badge>
                                  ),
                                )
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  No amenities listed
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-neutral-200">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={handleCloseDetailModal}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          className="flex-1"
                          onClick={() => {
                            handleCloseDetailModal();
                            // Trigger booking with the selected van
                            handleBookClick(selectedVanDetail);
                          }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Book This Van
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-neutral-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Van details not available
                      </h3>
                      <p className="text-neutral-600">
                        Unable to load van information. Please try again later.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
