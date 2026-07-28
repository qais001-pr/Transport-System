const apiConstant = {
  baseUrl: import.meta.env.VITE_API_URL,
  register: "/auth/register",
  login: "/auth/login",
  verifyOtp: "/auth/verify-otp",
  resendOtp: "/auth/resend-otp",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  me: "/users/profile/me",
  user: {
    editProfile: "/users/profile/me/edit",
  },

  //school
  allSchools: "/schools/all-schools",
  school: {
    allDrivers: "/schools/all-drivers",
    driverReports: "/schools/driver-metrics",
    complaints: "/schools/all-complaints",
    verifyComplaint: "/schools/verify-complaint",
    viewSpecificDriverComplaints: "/schools/driver-complaints",
    schoolGuards: "/schools/school-guards",
    approveGuard: "/schools/approve-guard",
    schoolData: "/schools/school-data",
    addSchoolBranch: "/schools/add-school-branch",
    updateSchoolBranch: "/schools/update-school-branch",
    deleteSchoolBranch: "/schools/delete-school-branch",
  },

  //parent
  addChild: "/parents/add-children",
  children: "/parents/children",
  giveFeedback: "/parents/feedback",
  feedbackHistory: "/parents/feedback-history",
  giveComplaint: "/parents/complaints",
  complaintHistory: "/parents/complaints-history",
  paymentHistory: "/parents/payment-history",
  allActiveVans: "/parents/vans/all",
  vanDetail: "/parents/vans",
  bookVan: "/parents/vans/book",
  bookings: "/parents/bookings",
  payment: "/parents/payment/pay-now",
  allBookedDrivers: "/parents/all-booked-drivers",
  childrenForLeave: "/parents/children-for-leave",
  leaveHistory: "/parents/leave-history",
  leaveRequest: "/parents/leave",
  vanFeedback: "/parents/van-feedback",

  //driver
  createNewRoute: "/drivers/create-new-route",
  myRoutes: "/drivers/driver-routes",
  updateRoute: "/drivers/update-route-location",
  deleteRoute: "/drivers/delete-route",
  assignedStudents: "/drivers/assigned-students",
  allStudents: "/drivers/all-students",
  studentDetail: "/drivers/student-details",
  earning: "/drivers/earning-by-year",
  studentPaymentHistory: "/drivers/payment-history",
  leaveDriver: "/drivers/leave-and-assign-new-driver",
  restoteDriver: "/drivers/restore-driver",
  studentFeedback: "/drivers/feedback",
  studentFeedbackHistory: "/drivers/feedback-history",
  studentComplaint: "/drivers/complaints",
  studentComplaintHistory: "/drivers/complaints-history",
  delayReports: "/drivers/delay-reports",
  earningPerStudents: "/drivers/earning-per-students",
  latestEarnings: "/drivers/latest-earnings",
  routeDetail: "/drivers/route-detail",
  newDrivers: "/drivers/new-drivers",
  assignedDrivers: "/drivers/assigned-drivers",
  vanDetails: "/drivers/van-details",
  addVan: "/drivers/add-van",
  updateVan: "/drivers/update-van",
  deleteVan: "/drivers/delete-van",

  //guards
  guard: {
    activeVans: "/guards/active-vans",
    pendingStudents: "/guards/students-to-verify",
    verifySingleStudent: "/guards/verify-student",
    verifyAllStudents: "/guards/verify-all-students",
    allStudents: "/guards/all-students",
    studentDetail: "/guards/student-details",
    vanDetail: "/guards/get-van-details",
    recentVerifiedStudents: "/guards/recent-verified-students",
  },

  //police
  police: {
    driverApplications: "/police/driver-applications",
    verifyDriver: "/police/verify-driver",
    report: "/police/report",
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
