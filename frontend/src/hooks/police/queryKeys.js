export const policeQueryKeys = {
  all: ["police"],
  driverApplications: () => [...policeQueryKeys.all, "driver-applications"],
  verifyDriver: () => [...policeQueryKeys.all, "verify-driver"],
  reports: () => [...policeQueryKeys.all, "reports"],
};
