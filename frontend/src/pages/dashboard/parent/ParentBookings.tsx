import { useState, useContext } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Car,
  RefreshCw,
  User,
  AlertTriangle,
  Loader2,
} from "lucide-react";
//@ts-ignore
import { useBooking } from "@/hooks/parents/get/useBooking";
//@ts-ignore
import { useCancelBooking } from "@/hooks/parents/useCancelBooking";
//@ts-ignore
import { usePayNow } from "@/hooks/parents/usePayNow";
//@ts-ignore
import useRebook from "@/hooks/parents/useRebook";
//@ts-ignore
import userContext from "@/context/userContext";
import { toast } from "react-toastify";

interface Booking {
  id: string;
  child_name: string;
  driver_name: string;
  number_plate: string;
  pick_up_time: string;
  drop_off_time: string;
  van_address: string;
  fare: string;
  status: string;
  booked_at: string;
  van_id: string;
  payment_status: string;
  pickup_address: string;
}

export default function ParentBookings() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [bookingDetail, setBookingDetail] = useState<any>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const { user, logOut }: any = useContext(userContext);
  const {
    data: bookingData,
    isLoading: bookingLoading,
    isError: bookingError,
  } = useBooking();

  const bookings: Booking[] = bookingData?.bookings || [];

  const { mutate: rebook, isPending: rebookLoading } = useRebook();

  const { mutate: cancelBooking, isPending: cancelLoading } =
    useCancelBooking();

  const { mutate: payNow, isPending: payLoading } = usePayNow();

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => b.status === "ACTIVE").length;
  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;
  const cancelledBookings = bookings.filter(
    (b) => b.status === "CANCELLED",
  ).length;

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings.toString(),
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary-50",
    },
    {
      title: "Active",
      value: activeBookings.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completed",
      value: completedBookings.toString(),
      icon: CheckCircle,
      color: "text-secondary",
      bgColor: "bg-secondary-50",
    },
    {
      title: "Cancelled",
      value: cancelledBookings.toString(),
      icon: XCircle,
      color: "text-accent",
      bgColor: "bg-accent-50",
    },
  ];

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status.toLowerCase() === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "completed":
        return "secondary";
      case "cancelled":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleViewDetails = (bookingId: string, bookingDetail: any) => {
    setSelectedBookingId(bookingId);
    setBookingDetail(bookingDetail);
    setShowDetailModal(true);
  };

  const handleOpenPayment = (booking: any) => {
    setBookingDetail(booking);
    setSelectedBookingId(booking?.id || null);
    setPaymentFile(null);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentFile(null);
  };

  const handlePaymentFileChange = (e: any) => {
    const file = e.target.files && e.target.files[0];
    setPaymentFile(file || null);
  };

  const handleSubmitPayment = () => {
    if (!bookingDetail?.id || !paymentFile)
      return toast.error("Please upload a payment receipt.");
    const formData = new FormData();
    if (paymentFile) {
      formData.append("proof_photo", paymentFile);
    }

    payNow(
      { id: bookingDetail.id, data: formData },
      {
        onSuccess: () => {
          closePaymentModal();
          setShowDetailModal(false);
          setSelectedBookingId(null);
        },
      },
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!bookingId) return;
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(
        { bookingId },
        {
          onSuccess: () => {
            setShowDetailModal(false);
            setSelectedBookingId(null);
          },
        },
      );
    }
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedBookingId(null);
  };

  if (bookingLoading) {
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
            <p className="mt-4 text-neutral-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (bookingError) {
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
              Failed to load bookings. Please try again later.
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          title="Booking History"
          subtitle="View and manage all your van bookings"
          role={user?.role || "Guest"}
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
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterStatus === "all" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All Bookings
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </Button>
                  <Button
                    variant={
                      filterStatus === "completed" ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterStatus("completed")}
                  >
                    Completed
                  </Button>
                  <Button
                    variant={
                      filterStatus === "cancelled" ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterStatus("cancelled")}
                  >
                    Cancelled
                  </Button>
                </div>

                <div className="flex gap-2">
                  {/* <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                    Export
                  </Button> */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <Card key={booking.id} hover>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-neutral-900">
                                Booking #{booking.id}
                              </h3>
                              <Badge variant={getStatusColor(booking?.status)}>
                                {booking.status === "ACTIVE" && (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                                {booking.status === "CANCELLED" && (
                                  <XCircle className="w-3 h-3" />
                                )}
                                {booking.status === "COMPLETED" && (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                                {booking.status.charAt(0).toUpperCase() +
                                  booking.status.slice(1).toLowerCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-neutral-600">
                              {booking.van_address}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Child Info */}
                          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                            <Avatar name={booking.child_name} size="md" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                Child
                              </p>
                              <p className="text-sm text-neutral-600">
                                {booking.child_name}
                              </p>
                            </div>
                          </div>

                          {/* Van Info */}
                          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                              <Car className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                Van & Driver
                              </p>
                              <p className="text-sm text-neutral-600">
                                {booking.number_plate} • {booking.driver_name}
                              </p>
                            </div>
                          </div>

                          {/* Pickup Location */}
                          <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                Pickup Location
                              </p>
                              <p className="text-sm text-neutral-600">
                                {booking.pickup_address}
                              </p>
                            </div>
                          </div>

                          {/* Timing */}
                          <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                            <Clock className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                Timing
                              </p>
                              <p className="text-sm text-neutral-600">
                                Pickup: {formatTime(booking.pick_up_time)} •
                                Drop: {formatTime(booking.drop_off_time)}
                              </p>
                            </div>
                          </div>

                          {/* Booking Date */}
                          <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                Booked On
                              </p>
                              <p className="text-sm text-neutral-600">
                                {formatDate(booking.booked_at)}
                              </p>
                            </div>
                          </div>

                          {/* Monthly Fee */}
                          <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                Monthly Fee
                              </p>
                              <p className="text-sm text-neutral-600">
                                Rs.{parseFloat(booking.fare).toFixed(2)}/month
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="lg:w-48 flex flex-col gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => handleViewDetails(booking.id, booking)}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>

                        {booking.status === "ACTIVE" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <MapPin className="w-4 h-4" />
                              Track Van
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleOpenPayment(booking)}
                            >
                              <DollarSign className="w-4 h-4" />
                              Pay Now
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-accent hover:bg-accent-50"
                              onClick={() =>
                                booking?.id && handleCancelBooking(booking.id)
                              }
                              disabled={cancelLoading}
                            >
                              {cancelLoading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel Booking
                                </>
                              )}
                            </Button>
                          </>
                        )}

                        {booking.status === "COMPLETED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Download className="w-4 h-4" />
                            Download Receipt
                          </Button>
                        )}

                        {booking.status === "CANCELLED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={rebookLoading}
                            onClick={() => rebook({ bookingId: booking.id })}
                          >
                            {rebookLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Rebooking...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4" />
                                Rebook
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    No bookings found
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    {filterStatus === "all"
                      ? "You haven't made any bookings yet"
                      : `No ${filterStatus} bookings found`}
                  </p>
                  <Button variant="primary">
                    <Car className="w-4 h-4" />
                    Find a Van
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        {/* Booking Detail Modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Booking Details
                  </h2>
                  <Button variant="outline" size="sm" onClick={closeModal}>
                    ✕
                  </Button>
                </div>

                {/* {detailLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-neutral-600">
                      Loading details...
                    </span>
                  </div>
                ) :  */}
                {bookingDetail ? (
                  <div className="space-y-6">
                    {/* Booking Header */}
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900">
                            Booking #{bookingDetail.id}
                          </h3>
                          <p className="text-sm text-neutral-600 mt-1">
                            Booked on{" "}
                            {bookingDetail?.booked_at
                              ? formatDate(bookingDetail.booked_at)
                              : "N/A"}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(bookingDetail?.status)}>
                          {bookingDetail?.status === "ACTIVE" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {bookingDetail?.status === "CANCELLED" && (
                            <XCircle className="w-3 h-3" />
                          )}
                          {bookingDetail?.status === "COMPLETED" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {bookingDetail?.status?.charAt(0).toUpperCase() +
                            bookingDetail?.status?.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Child Information */}
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Child Information
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={bookingDetail?.child_name || "Unknown"}
                                size="sm"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {bookingDetail?.child_name || "Unknown Child"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Van Information */}
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                            <Car className="w-4 h-4 mr-2" />
                            Van Information
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">
                                Van Number
                              </span>
                              <span className="text-sm font-medium">
                                {bookingDetail?.number_plate || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">
                                Driver
                              </span>
                              <span className="text-sm font-medium">
                                {bookingDetail?.driver_name || "N/A"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Timing Information */}
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Timing
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">
                                Pickup Time
                              </span>
                              <span className="text-sm font-medium">
                                {bookingDetail?.pick_up_time
                                  ? formatTime(bookingDetail.pick_up_time)
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">
                                Drop-off Time
                              </span>
                              <span className="text-sm font-medium">
                                {bookingDetail?.drop_off_time
                                  ? formatTime(bookingDetail.drop_off_time)
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Location Information */}
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Location
                          </h4>
                          <div className="space-y-2">
                            <p className="text-sm text-neutral-600">
                              {bookingDetail?.van_address || "N/A"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Payment Information */}
                      <Card className="md:col-span-2">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Payment Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-secondary-50 rounded-lg p-3">
                              <p className="text-sm text-neutral-600">
                                Monthly Fee
                              </p>
                              <p className="text-lg font-bold text-secondary">
                                Rs.
                                {bookingDetail?.fare
                                  ? parseFloat(bookingDetail.fare).toFixed(2)
                                  : "0.00"}
                              </p>
                            </div>
                            <div className="bg-neutral-50 rounded-lg p-3">
                              <p className="text-sm text-neutral-600">Status</p>
                              <p className="text-lg font-medium text-neutral-900">
                                {bookingDetail?.payment_status || "Unknown"}
                              </p>
                            </div>
                            <div className="bg-neutral-50 rounded-lg p-3">
                              <p className="text-sm text-neutral-600">
                                Next Payment
                              </p>
                              <p className="text-lg font-medium text-neutral-900">
                                Due Soon
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-neutral-200">
                      {bookingDetail?.status === "ACTIVE" && (
                        <>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={closeModal}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            className="flex-1"
                            onClick={() => handleOpenPayment(bookingDetail)}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Make Payment
                          </Button>
                        </>
                      )}

                      {bookingDetail?.status === "COMPLETED" && (
                        <Button variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </Button>
                      )}

                      {bookingDetail?.status === "CANCELLED" && (
                        <Button variant="outline" className="flex-1">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Rebook Service
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-neutral-600">
                      Booking details not available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Make Payment</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={closePaymentModal}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-600">Booking</p>
                    <p className="font-medium">#{bookingDetail?.id || "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-600">Amount</p>
                    <p className="font-bold text-secondary">
                      Rs.
                      {bookingDetail?.fare
                        ? parseFloat(bookingDetail.fare).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-600">Payment Status</p>
                    <p className="font-bold text-secondary">
                      {bookingDetail?.payment_status}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">
                      Upload Payment Receipt *
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handlePaymentFileChange}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={closePaymentModal}
                    disabled={payLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleSubmitPayment}
                    disabled={
                      payLoading || bookingDetail?.payment_status === "PAID"
                    }
                  >
                    {payLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Pay Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
