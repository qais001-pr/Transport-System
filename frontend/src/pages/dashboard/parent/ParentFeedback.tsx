import { useContext, useMemo, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import {
  Search,
  MessageSquare,
  Star,
  Send,
  History,
  User,
  Calendar,
  X,
  Mail,
  Phone,
} from "lucide-react";

// @ts-ignore
import userContext from "../../../context/userContext";

// @ts-ignore
import { useAllBookedDrivers } from "../../../hooks/parents/get/useAllBookedDrivers";

// @ts-ignore
import useFeedbackHistory from "../../../hooks/parents/get/useFeedbackHistory";

// @ts-ignore
import useGiveFeedback from "../../../hooks/parents/useGiveFeedback";

// @ts-ignore
import useVanFeedback from "../../../hooks/parents/post/useVanFeedback";

export default function ParentFeedback() {
  const { user, logOut }: any = useContext(userContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showVanFeedbackModal, setShowVanFeedbackModal] = useState(false);

  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);

  const [vanFeedbackText, setVanFeedbackText] = useState("");
  const [vanRating, setVanRating] = useState(5);

  const { data: bookedDriversData, isLoading: driversLoading } =
    useAllBookedDrivers();

  const { data: feedbackHistoryData, isLoading: historyLoading } =
    useFeedbackHistory();

  const feedbackMutation = useGiveFeedback();
  const vanFeedbackMutation = useVanFeedback();

  const drivers = useMemo(() => {
    const payload = bookedDriversData?.data || bookedDriversData || [];

    return Array.isArray(payload)
      ? payload.map((driver: any) => ({
          id: driver.id || 0,
          van_id: driver.van_id || driver.vehicle_id || null,
          name: driver.full_name || driver.driver_name || "Driver Name",
          email: driver.email || "driver@example.com",
          phone: driver.phone || driver.contact || "N/A",
          vanNumber: driver.van_number_plate || driver.vehicle_number || "N/A",
          route: driver.route_name || driver.route || "Assigned Route",
          profilePhoto: driver.profile_photo || driver.driver_photo || "",
          status: driver.status || "N/A",
          child_id: driver.child_id || driver.childId || null,
        }))
      : [];
  }, [bookedDriversData]);

  const historyList = useMemo(() => {
    const payload = feedbackHistoryData || [];
    return Array.isArray(payload) ? payload : [];
  }, [feedbackHistoryData]);

  const filteredDrivers = drivers.filter((driver: any) => {
    const query = searchTerm.toLowerCase();

    return (
      driver.name.toLowerCase().includes(query) ||
      driver.email.toLowerCase().includes(query) ||
      driver.vanNumber.toLowerCase().includes(query) ||
      driver.route.toLowerCase().includes(query)
    );
  });

  const totalDrivers = drivers.length;
  const totalFeedbacks = historyList.length;

  const averageRating = totalFeedbacks
    ? (
        historyList.reduce(
          (sum: number, item: any) => sum + (item.rating || item.stars || 0),
          0,
        ) / totalFeedbacks
      ).toFixed(1)
    : "0.0";

  const recentCount = historyList.filter((item: any) => {
    const createdAt = new Date(
      item.created_at || item.date || item.createdAt || Date.now(),
    );

    const daysAgo = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    return daysAgo <= 30;
  }).length;

  const selectedDriverHistory = selectedDriver
    ? historyList.filter(
        (item: any) =>
          item.id === selectedDriver.id ||
          item.driver === selectedDriver.name ||
          item.name === selectedDriver.name,
      )
    : historyList;

  const handleOpenFeedback = (driver: any) => {
    setSelectedDriver(driver);
    setRating(5);
    setFeedbackText("");
    setShowFeedbackModal(true);
  };

  const handleOpenVanFeedback = (driver: any) => {
    setSelectedDriver(driver);
    setVanRating(5);
    setVanFeedbackText("");
    setShowVanFeedbackModal(true);
  };

  const handleOpenHistory = (driver: any) => {
    setSelectedDriver(driver);
    setShowHistoryModal(true);
  };

  const handleSubmitFeedback = () => {
    if (!selectedDriver || !feedbackText.trim()) return;

    feedbackMutation.mutate(
      {
        driver_id: selectedDriver.id,
        child_id: selectedDriver?.child_id,
        rating,
        comments: feedbackText.trim(),
      },
      {
        onSuccess: () => {
          setShowFeedbackModal(false);
          setFeedbackText("");
          setRating(5);
        },
      },
    );
  };

  const handleSubmitVanFeedback = () => {
    if (!selectedDriver || !vanFeedbackText.trim()) return;

    vanFeedbackMutation.mutate(
      {
        van_id: selectedDriver.van_id,
        rating: vanRating,
        comments: vanFeedbackText.trim(),
      },
      {
        onSuccess: () => {
          setShowVanFeedbackModal(false);
          setVanFeedbackText("");
          setVanRating(5);
        },
      },
    );
  };

  const renderStars = (
    value: number,
    interactive = false,
    type: "driver" | "van" = "driver",
  ) => {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <Star
            key={starValue}
            className={`w-5 h-5 transition-all ${
              starValue <= value
                ? "text-yellow-400 fill-yellow-400"
                : "text-neutral-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={
              interactive
                ? () => {
                    if (type === "driver") {
                      setRating(starValue);
                    } else {
                      setVanRating(starValue);
                    }
                  }
                : undefined
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar
        userRole={user?.role || "parent"}
        userName={user?.full_name || "Parent"}
        userEmail={user?.email || "parent@example.com"}
        logOut={logOut}
      />

      <div className="flex-1 min-w-0 overflow-hidden">
        <Header
          title="Driver Feedback"
          subtitle="Share your experience and review your assigned drivers."
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="w-full max-w-[1700px] mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-sm border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Drivers</p>
                    <h2 className="text-2xl font-bold mt-1">{totalDrivers}</h2>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Feedbacks</p>
                    <h2 className="text-2xl font-bold text-green-600 mt-1">
                      {totalFeedbacks}
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Average Rating</p>
                    <h2 className="text-2xl font-bold text-yellow-500 mt-1">
                      {averageRating}
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Last 30 Days</p>
                    <h2 className="text-2xl font-bold text-blue-600 mt-1">
                      {recentCount}
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEARCH */}
          <Card className="mb-6 shadow-sm border-0">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div className="relative w-full lg:flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />

                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, route, van number or email..."
                    className="pl-10 h-11"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="px-3 py-2 text-xs">
                    {filteredDrivers.length} / {drivers.length}
                  </Badge>

                  {selectedDriver && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDriver(null)}
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
            {/* LEFT */}
            <div className="2xl:col-span-8 space-y-5">
              {driversLoading ? (
                <Card>
                  <CardContent className="p-10 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
                    <p>Loading drivers...</p>
                  </CardContent>
                </Card>
              ) : filteredDrivers.length === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center">
                    <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Drivers Found
                    </h3>

                    <p className="text-neutral-500">
                      Try changing your search keyword.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredDrivers.map((driver: any) => (
                  <Card
                    key={driver.id}
                    className="border-0 shadow-sm hover:shadow-md transition-all"
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col xl:flex-row gap-5 xl:items-center xl:justify-between">
                        {/* LEFT INFO */}
                        <div className="flex flex-col sm:flex-row gap-4 min-w-0 flex-1">
                          <div className="flex justify-center sm:block">
                            <Avatar
                              name={driver.name}
                              src={driver.profilePhoto}
                              size="xl"
                            />
                          </div>

                          <div className="min-w-0 flex-1 text-center sm:text-left">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="text-lg font-semibold text-neutral-900 truncate">
                                  {driver.name}
                                </h3>

                                <p className="text-sm text-neutral-500 mt-1 break-words">
                                  {driver.vanNumber} • {driver.route}
                                </p>
                              </div>

                              <div>
                                <Badge
                                  variant="secondary"
                                  className="whitespace-nowrap"
                                >
                                  Driver
                                </Badge>
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-neutral-600 break-all">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                <span>{driver.email}</span>
                              </div>

                              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-neutral-600">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span>{driver.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 w-full xl:w-[220px]">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleOpenHistory(driver)}
                          >
                            <History className="w-4 h-4 mr-2" />
                            View Feedback
                          </Button>

                          <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => handleOpenVanFeedback(driver)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Van Feedback
                          </Button>

                          <Button
                            variant="primary"
                            className="w-full"
                            onClick={() => handleOpenFeedback(driver)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Driver Feedback
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* RIGHT */}
            <div className="2xl:col-span-4">
              <Card className="border-0 shadow-sm sticky top-4">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Feedback Activity
                      </h3>

                      <p className="text-sm text-neutral-500 mt-1">
                        {selectedDriver
                          ? `Showing feedback for ${selectedDriver.name}`
                          : "Showing all feedback history"}
                      </p>
                    </div>

                    <Badge variant="secondary" className="w-fit">
                      {selectedDriverHistory.length} Records
                    </Badge>
                  </div>

                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    {historyLoading ? (
                      <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
                        <p>Loading history...</p>
                      </div>
                    ) : selectedDriverHistory.length === 0 ? (
                      <div className="text-center py-10">
                        <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />

                        <p className="text-neutral-500">
                          No feedback history found.
                        </p>
                      </div>
                    ) : (
                      selectedDriverHistory.map((item: any, index: number) => (
                        <Card
                          key={index}
                          className="border-l-4 border-l-primary"
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col gap-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium">
                                    {item.driver || item.name || "Driver"}
                                  </p>

                                  <p className="text-xs text-neutral-500 mt-1">
                                    {new Date(
                                      item.created_at ||
                                        item.date ||
                                        Date.now(),
                                    ).toLocaleDateString()}
                                  </p>
                                </div>

                                {renderStars(item.rating || item.stars || 5)}
                              </div>

                              <p className="text-sm text-neutral-700 leading-relaxed break-words">
                                {item.comments ||
                                  item.feedback ||
                                  "No comment provided."}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* DRIVER FEEDBACK MODAL */}
      {showFeedbackModal && selectedDriver && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <Card className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[95vh] overflow-y-auto">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold">Driver Feedback</h3>

                  <p className="text-sm text-neutral-500 mt-1">
                    Review {selectedDriver.name}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar
                    name={selectedDriver.name}
                    src={selectedDriver.profilePhoto}
                    size="lg"
                  />

                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {selectedDriver.name}
                    </p>

                    <p className="text-sm text-neutral-500 break-words">
                      {selectedDriver.vanNumber} • {selectedDriver.route}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Rating
                  </label>

                  {renderStars(rating, true, "driver")}
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Feedback
                  </label>

                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Write your feedback..."
                    className="w-full min-h-[140px] rounded-2xl border border-neutral-300 p-4 outline-none resize-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowFeedbackModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSubmitFeedback}
                    disabled={
                      feedbackMutation.isPending || !feedbackText.trim()
                    }
                  >
                    {feedbackMutation.isPending
                      ? "Sending..."
                      : "Submit Feedback"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* VAN FEEDBACK MODAL */}
      {showVanFeedbackModal && selectedDriver && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <Card className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[95vh] overflow-y-auto">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold">Van Feedback</h3>

                  <p className="text-sm text-neutral-500 mt-1">
                    Review van {selectedDriver.vanNumber}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVanFeedbackModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="font-semibold">{selectedDriver.vanNumber}</p>

                  <p className="text-sm text-neutral-500 mt-1">
                    Route: {selectedDriver.route}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Rating
                  </label>

                  {renderStars(vanRating, true, "van")}
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Feedback
                  </label>

                  <textarea
                    value={vanFeedbackText}
                    onChange={(e) => setVanFeedbackText(e.target.value)}
                    placeholder="Write your van feedback..."
                    className="w-full min-h-[140px] rounded-2xl border border-neutral-300 p-4 outline-none resize-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowVanFeedbackModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSubmitVanFeedback}
                    disabled={
                      vanFeedbackMutation.isPending || !vanFeedbackText.trim()
                    }
                  >
                    {vanFeedbackMutation.isPending
                      ? "Sending..."
                      : "Submit Feedback"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistoryModal && selectedDriver && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <Card className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[95vh] overflow-y-auto">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedDriver.name} Feedback
                  </h3>

                  <p className="text-sm text-neutral-500 mt-1">
                    Feedback history
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistoryModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {selectedDriverHistory.length === 0 ? (
                  <div className="text-center py-10">
                    <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />

                    <p className="text-neutral-500">No feedback available.</p>
                  </div>
                ) : (
                  selectedDriverHistory.map((item: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <p className="text-sm font-medium">
                              {new Date(
                                item.created_at || item.date || Date.now(),
                              ).toLocaleDateString()}
                            </p>

                            {renderStars(item.rating || item.stars || 5)}
                          </div>

                          <p className="text-sm text-neutral-700 leading-relaxed break-words">
                            {item.comments ||
                              item.feedback ||
                              "No comment provided."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
