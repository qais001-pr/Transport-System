const apiConstant = {
  baseUrl: import.meta.env.VITE_API_URL,
  //auth
  register: "/api/auth/register",
  login: "/api/auth/login",
  verifyOtp: "/api/auth/verify-otp",
  resendOtp: "/api/auth/resend-otp",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  me: "/api/users/profile/me",
  user: {
    editProfile: "/api/users/profile/me/edit",
  },

  //school
  allSchools: "/api/schools/all-schools",
  school: {
    allDrivers: "/api/schools/all-drivers",
    driverReports: "/api/schools/driver-metrics",
    complaints: "/api/schools/all-complaints",
    verifyComplaint: "/api/schools/verify-complaint",
    viewSpecificDriverComplaints: "/api/schools/driver-complaints",
    schoolGuards: "/api/schools/school-guards",
    approveGuard: "/api/schools/approve-guard",
    schoolData: "/api/schools/school-data",
    addSchoolBranch: "/api/schools/add-school-branch",
    updateSchoolBranch: "/api/schools/update-school-branch",
    deleteSchoolBranch: "/api/schools/delete-school-branch",
  },

  //parent
  addChild: "/api/parents/add-children",
  children: "/api/parents/children",
  giveFeedback: "/api/parents/feedback",
  feedbackHistory: "/api/parents/feedback-history",
  giveComplaint: "/api/parents/complaints",
  complaintHistory: "/api/parents/complaints-history",
  paymentHistory: "/api/parents/payment-history",
  allActiveVans: "/api/parents/vans/all",
  vanDetail: "/api/parents/vans",
  bookVan: "/api/parents/vans/book",
  bookings: "/api/parents/bookings",
  payment: "/api/parents/payment/pay-now",
  allBookedDrivers: "/api/parents/all-booked-drivers",
  childrenForLeave: "/api/parents/children-for-leave",
  leaveHistory: "/api/parents/leave-history",
  leaveRequest: "/api/parents/leave",
  vanFeedback: "/api/parents/van-feedback",

  //driver
  createNewRoute: "/api/drivers/create-new-route",
  myRoutes: "/api/drivers/driver-routes",
  updateRoute: "/api/drivers/update-route-location",
  deleteRoute: "/api/drivers/delete-route",
  assignedStudents: "/api/drivers/assigned-students",
  allStudents: "/api/drivers/all-students",
  studentDetail: "/api/drivers/student-details",
  earning: "/api/drivers/earning-by-year",
  studentPaymentHistory: "/api/drivers/payment-history",
  leaveDriver: "/api/drivers/leave-and-assign-new-driver",
  restoteDriver: "/api/drivers/restore-driver",
  studentFeedback: "/api/drivers/feedback",
  studentFeedbackHistory: "/api/drivers/feedback-history",
  studentComplaint: "/api/drivers/complaints",
  studentComplaintHistory: "/api/drivers/complaints-history",
  delayReports: "/api/drivers/delay-reports",
  earningPerStudents: "/api/drivers/earning-per-students",
  latestEarnings: "/api/drivers/latest-earnings",
  routeDetail: "/api/drivers/route-detail",
  newDrivers: "/api/drivers/new-drivers",
  assignedDrivers: "/api/drivers/assigned-drivers",
  vanDetails: "/api/drivers/van-details",
  addVan: "/api/drivers/add-van",
  updateVan: "/api/drivers/update-van",
  deleteVan: "/api/drivers/delete-van",

  //guards
  guard: {
    activeVans: "/api/guards/active-vans",
    pendingStudents: "/api/guards/students-to-verify",
    verifySingleStudent: "/api/guards/verify-student",
    verifyAllStudents: "/api/guards/verify-all-students",
    allStudents: "/api/guards/all-students",
    studentDetail: "/api/guards/student-details",
    vanDetail: "/api/guards/get-van-details",
    recentVerifiedStudents: "/api/guards/recent-verified-students",
  },

  //police
  police: {
    driverApplications: "/api/police/driver-applications",
    verifyDriver: "/api/police/verify-driver",
    report: "/api/police/report",
  },
};

// Helper function to convert file path to URL
export const getFileUrl = (filePath) => {
  if (!filePath) return null;

  // If already an HTTP URL, return as-is
  if (filePath.startsWith("http")) return filePath;

  // If it starts with /uploads, prepend baseUrl
  if (filePath.startsWith("/uploads")) {
    return `${apiConstant.baseUrl}${filePath}`;
  }

  // Convert Windows path to URL path
  // Match paths like "E:\path\uploads\drivers\temp\file.jpg"
  const match = filePath.match(/uploads(.*)$/i);
  if (match) {
    const relativePath = match[1].replace(/\\/g, "/");
    return `${apiConstant.baseUrl}/uploads${relativePath}`;
  }

  // Fallback: assume it's a relative path
  return `${apiConstant.baseUrl}${filePath}`;
};
export default apiConstant;
