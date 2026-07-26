const express = require("express");
const verifyToken = require("../../middlewares/verifyToken");
const {
  createNewRoute,
  getDriverRoutes,
  updateRouteLocation,
  deleteRoute,
  viewAssignedStudents,
  viewStudentDetails,
  getEarningByYear,
  viewPaymentHistory,
  leaveAndAssignNewDriver,
  restoreDriver,
  getFeedback,
  getFeedbackHistory,
  doComplaints,
  getComplaintsHistory,
  allStudents,
  delayReports,
  earningPerStudents,
  routeDetail,
  getNewDriversExceptCurrent,
  getAssignedDrivers,
} = require("../../controllers/drivers/driverController");
const { validateRequest } = require("../../middlewares/errorsHandling");
const {
  createNewRouteValidation,
  updateRouteValidation,
} = require("../../validation/driver/driverValidation");
const {
  feedbackValidation,
} = require("../../validation/parents/feedbackValidation");
const {
  getVans,
  addVan,
  updateVan,
  deleteVan,
} = require("../../controllers/vans/vanController");
const upload = require("../../middlewares/upload");
const router = express.Router();

router.post(
  "/create-new-route",
  verifyToken,
  validateRequest(createNewRouteValidation),
  createNewRoute,
);
router.get("/driver-routes", verifyToken, getDriverRoutes);
router.put(
  "/update-route-location/:routeId",
  verifyToken,
  validateRequest(updateRouteValidation),
  updateRouteLocation,
);
router.delete("/delete-route/:routeId", verifyToken, deleteRoute);
router.get("/assigned-students/:routeId", verifyToken, viewAssignedStudents);
router.get("/student-details/:studentId", verifyToken, viewStudentDetails);
router.get("/earning-by-year", verifyToken, getEarningByYear);
router.get("/payment-history", verifyToken, viewPaymentHistory);
router.post(
  "/leave-and-assign-new-driver",
  verifyToken,
  leaveAndAssignNewDriver,
);
router.put("/restore-driver", verifyToken, restoreDriver);
router.post("/feedback", verifyToken, getFeedback);
router.get("/feedback-history/:child_id", verifyToken, getFeedbackHistory);
router.post("/complaints", verifyToken, doComplaints);
router.get("/complaints-history", verifyToken, getComplaintsHistory);
router.get("/all-students", verifyToken, allStudents);
router.get("/delay-reports", verifyToken, delayReports);
router.get("/earning-per-students", verifyToken, earningPerStudents);
router.get("/route-detail", verifyToken, routeDetail);
router.get("/new-drivers", verifyToken, getNewDriversExceptCurrent);
router.get("/assigned-drivers", verifyToken, getAssignedDrivers);
router.get("/van-details", verifyToken, getVans);
router.post(
  "/add-van",
  verifyToken,
  upload.fields([{ name: "photo_url", maxCount: 1 }]),
  addVan,
);
router.put(
  "/update-van/:vanId",
  verifyToken,
  upload.fields([{ name: "photo_url", maxCount: 1 }]),
  updateVan,
);
router.delete("/delete-van/:vanId", verifyToken, deleteVan);

module.exports = router;
