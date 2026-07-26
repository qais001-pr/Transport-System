export const guardQueryKeys = {
  all: ["guards"],
  activeVans: () => [...guardQueryKeys.all, "active-vans"],
  pendingStudents: () => [...guardQueryKeys.all, "pending-students"],
  vanDetail: (vanId) => [...guardQueryKeys.all, "van-detail", vanId],
  allStudents: () => [...guardQueryKeys.all, "all-students"],
  studentDetail: (studentId) => [
    ...guardQueryKeys.all,
    "student-detail",
    studentId,
  ],
  verifySingleStudent: (studentId) => [
    ...guardQueryKeys.all,
    "verify-student",
    studentId,
  ],
  verifyAllStudents: () => [...guardQueryKeys.all, "verify-all-students"],
  recentVerifiedStudents: () => [...guardQueryKeys.all, "recent-verified-students"],
};
