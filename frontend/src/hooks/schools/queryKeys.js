export const schoolQueryKeys = {
  all: ["schools"],

  drivers: () => [...schoolQueryKeys.all, "drivers"],
  guards: () => [...schoolQueryKeys.all, "guards"],
  approveGuard: (guardId) => [...schoolQueryKeys.guards(), "approveGuard", guardId],

  branches: () => [...schoolQueryKeys.all, "branches"],
  addBranch: () => [...schoolQueryKeys.branches(), "addBranch"],
  updateBranch: (branchId) => [...schoolQueryKeys.branches(), "updateBranch", branchId],
  deleteBranch: (branchId) => [...schoolQueryKeys.branches(), "deleteBranch", branchId],

  complaints: () => [...schoolQueryKeys.all, "complaints"],
  complaintResponses: (complaintId) => [
    ...schoolQueryKeys.complaints(),
    "responses",
    complaintId,
  ],
  specificDriverComplaints: (driverId) => [
    ...schoolQueryKeys.all,
    "specificDriverComplaints",
    driverId,
  ],

  reports: () => [...schoolQueryKeys.all, "reports"],
};
