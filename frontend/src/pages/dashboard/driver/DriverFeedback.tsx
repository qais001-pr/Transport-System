import { useContext, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import {
  Search,
  MessageSquare,
  Star,
  Users,
  Send,
  History,
  User,
  Calendar,
  X,
} from "lucide-react";
//@ts-ignore
import userContext from "../../../context/userContext";
//@ts-ignore
import useAllStudents from "../../../hooks/drivers/get/useAllStudents";
//@ts-ignore
import useStudentFeedbackHistory from "../../../hooks/drivers/get/useStudentFeedbackHistory";
//@ts-ignore
import useStudentFeedback from "../../../hooks/drivers/useStudentFeedback";
//@ts-ignore
import { getFileUrl } from "../../../api/apiConstant";

export default function DriverFeedback() {
  const { user, logOut }: any = useContext(userContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: "",
  });

  const { data: studentsData, isLoading: studentsLoading } = useAllStudents();
  const { data: feedbackHistory, isLoading: historyLoading } =
    useStudentFeedbackHistory(selectedStudent?.id);
  const feedbackMutation = useStudentFeedback();

  const students = (studentsData?.students || []).map((s: any) => ({
    id: s.child_info.id,
    name: s.child_info.full_name || "Student Name",
    email: s.parent_data.email || "student@example.com",
    phone: s.parent_data.phone || "student-phone",
    grade: s.child_info.grade || "Grade",
    school: s.school_info.address || "School Name",
    profilePhoto: s.child_info.child_pic || "",
    parentName: s.parent_data.full_name || "Parent Name",
    parent_id: s.parent_data.id,
  }));

  const filteredStudents = students.filter(
    (student: any) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleGiveFeedback = () => {
    if (!selectedStudent || !feedbackData.comment.trim()) return;

    feedbackMutation.mutate(
      {
        parent_id: selectedStudent.parent_id,
        child_id: selectedStudent.id,
        rating: feedbackData.rating,
        comments: feedbackData.comment,
      },
      {
        onSuccess: () => {
          setShowFeedbackModal(false);
          setFeedbackData({ rating: 5, comment: "" });
          setSelectedStudent(null);
        },
      },
    );
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void,
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "driver"}
        userName={user?.full_name || "Driver"}
        userEmail={user?.email || "driver@example.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header
          title="STUDENT FEEDBACK"
          subtitle={`Welcome back, ${user?.full_name || "Driver"}! Manage feedback for your students.`}
          role={user?.role}
          profile={user?.profile_photo || ""}
        />

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {students.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Feedback Given
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {students.length}{" "}
                      {/* Placeholder - would need actual count */}
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      Average Rating
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                        4.5 
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card> */}

            {/* <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      This Month
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      12 
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                      placeholder="Search students by name, email, or parent name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <div className="grid gap-6">
            {studentsLoading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-neutral-600">Loading students...</p>
                </CardContent>
              </Card>
            )}

            {!studentsLoading &&
              filteredStudents.map((student: any) => (
                <Card
                  key={student.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Student Info */}
                      <div className="flex items-start gap-4 flex-1">
                        {student.profilePhoto ? (
                          <Avatar
                            name={student.name}
                            src={getFileUrl(student.profilePhoto)}
                            size="xl"
                          />
                        ) : (
                          <Avatar name={student.name} size="xl" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900 truncate">
                              {student.name}
                            </h3>
                            <Badge variant="secondary" className="w-fit">
                              Grade {student.grade}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-600 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span className="truncate">
                                Parent: {student.parentName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="truncate">{student.school}</span>
                            </div>
                          </div>

                          <p className="text-sm text-neutral-700">
                            <strong>Email:</strong> {student.email}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-auto">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowHistoryModal(true);
                          }}
                        >
                          <History className="w-4 h-4 mr-2" />
                          View History
                        </Button>

                        <Button
                          variant="primary"
                          className="w-full sm:w-auto"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowFeedbackModal(true);
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Give Feedback
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {filteredStudents.length === 0 && !studentsLoading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  No students found
                </h3>
                <p className="text-neutral-600">
                  {searchTerm
                    ? "Try adjusting your search criteria."
                    : "No students are assigned to you yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Give Feedback</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-2">
                    Student: {selectedStudent.name}
                  </p>
                  <p className="text-sm text-neutral-600 mb-4">
                    Parent: {selectedStudent.parentName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">
                    Rating
                  </label>
                  {renderStars(feedbackData.rating, true, (rating) =>
                    setFeedbackData((prev) => ({ ...prev, rating })),
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">
                    Comment
                  </label>
                  <textarea
                    className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                    placeholder="Write your feedback here..."
                    value={feedbackData.comment}
                    onChange={(e) =>
                      setFeedbackData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowFeedbackModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleGiveFeedback}
                    disabled={
                      feedbackMutation.isPending || !feedbackData.comment.trim()
                    }
                  >
                    {feedbackMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Feedback
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Feedback History</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistoryModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-neutral-700">
                  Student: {selectedStudent.name}
                </p>
                <p className="text-sm text-neutral-600">
                  Parent: {selectedStudent.parentName}
                </p>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {historyLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-neutral-600">
                      Loading feedback history...
                    </p>
                  </div>
                ) : feedbackHistory?.feedbacks?.length > 0 ? (
                  feedbackHistory.feedbacks.map(
                    (feedback: any, index: number) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {renderStars(feedback.rating || 5)}
                              <span className="text-sm text-neutral-600">
                                {new Date(
                                  feedback.created_at || Date.now(),
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-neutral-700">
                            {feedback.comments || feedback.feedback}
                          </p>
                        </CardContent>
                      </Card>
                    ),
                  )
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-600">
                      No feedback history found for this student.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
