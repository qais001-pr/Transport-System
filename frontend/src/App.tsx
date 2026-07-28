import { Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
//@ts-ignore
import RegisterPage from "./pages/RegisterPage";
import ComponentsShowcase from "./pages/ComponentsShowcase";
//@ts-ignore
import VerifyOtp from "./pages/VerifyOtp";
//@ts-ignore
import ResetPassword from "./pages/ResetPassword";
//@ts-ignore
import ForgotPassword from "./pages/ForgotPassword";
//@ts-ignore
import Profile from "./pages/Profile";
//@ts-ignore
import SupportPage from './pages/support';
// Dashboard Pages
import ParentDashboard from "./pages/dashboard/parent/ParentDashboard";
import ParentChildren from "./pages/dashboard/parent/ParentChildren";
import ParentBookings from "./pages/dashboard/parent/ParentBookings";
import ParentVans from "./pages/dashboard/parent/ParentVans";
import ParentTrack from "./pages/dashboard/parent/ParentTrack";
import ParentPayments from "./pages/dashboard/parent/ParentPayments";
import ParentFeedback from "./pages/dashboard/parent/ParentFeedback";
import ParentChildrenLeave from "./pages/dashboard/parent/ParentChildrenLeave";

import DriverDashboard from "./pages/dashboard/driver/DriverDashboard";
import DriverRoutes from "./pages/dashboard/driver/DriverRoutes";
import DriverStudents from "./pages/dashboard/driver/DriverStudents";
import DriverSchedule from "./pages/dashboard/driver/DriverSchedule";
import DriverTracking from "./pages/dashboard/driver/DriverTracking";
import DriverEarnings from "./pages/dashboard/driver/DriverEarnings";
import DriverMessages from "./pages/dashboard/driver/DriverMessages";
import DriverDelays from "./pages/dashboard/driver/DriverDelays";
import DriverFeedback from "./pages/dashboard/driver/DriverFeedback";
import DriverLeaves from "./pages/dashboard/driver/DriverLeaves";
//@ts-ignore
import DriverVans from "./pages/dashboard/driver/DriverVans";

import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import AdminUsers from "./pages/dashboard/admin/AdminUsers";
import AdminDrivers from "./pages/dashboard/admin/AdminDrivers";
import AdminVans from "./pages/dashboard/admin/AdminVans";
import AdminRoutes from "./pages/dashboard/admin/AdminRoutes";
import AdminVerifications from "./pages/dashboard/admin/AdminVerifications";
import AdminComplaints from "./pages/dashboard/admin/AdminComplaints";
import AdminReports from "./pages/dashboard/admin/AdminReports";

import GuardDashboard from "./pages/dashboard/guard/GuardDashboard";
import GuardVans from "./pages/dashboard/guard/GuardVans";
import GuardStudents from "./pages/dashboard/guard/GuardStudents";
import GuardSchedule from "./pages/dashboard/guard/GuardSchedule";
import GuardVerification from "./pages/dashboard/guard/GuardVerification";
import GuardAlerts from "./pages/dashboard/guard/GuardAlerts";
import GuardReports from "./pages/dashboard/guard/GuardReports";

import SHOReports from "./pages/dashboard/sho/SHOReports";
import SHODashboard from "./pages/dashboard/sho/SHODashboard";
import SHOVerificationRecords from "./pages/dashboard/sho/SHOVerificationRecords";
import SHOViolations from "./pages/dashboard/sho/SHOViolations";

import SchoolComplaintDetail from "./pages/dashboard/school/SchoolComplaintDetail";
import SchoolDashboard from "./pages/dashboard/school/SchoolDashboard";
import SchoolComplaints from "./pages/dashboard/school/SchoolComplaints";
import SchoolDriverReports from "./pages/dashboard/school/SchoolDriverReports";
import SchoolGuards from "./pages/dashboard/school/SchoolGuards";
import SchoolBranches from "./pages/dashboard/school/SchoolBranches";

function App() {

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/components-showcase" element={<ComponentsShowcase />} />

      {/* Parent Dashboard Routes */}
      <Route path="/dashboard/parent" element={<ParentDashboard />} />
      <Route path="/dashboard/parent/children" element={<ParentChildren />} />
      <Route path="/dashboard/parent/bookings" element={<ParentBookings />} />
      <Route path="/dashboard/parent/vans" element={<ParentVans />} />
      <Route path="/dashboard/parent/track" element={<ParentTrack />} />
      <Route path="/dashboard/parent/payments" element={<ParentPayments />} />
      <Route path="/dashboard/parent/feedback" element={<ParentFeedback />} />
      <Route
        path="/dashboard/parent/children-leave"
        element={<ParentChildrenLeave />}
      />

      {/* Driver Dashboard Routes */}
      <Route path="/dashboard/driver" element={<DriverDashboard />} />
      <Route path="/dashboard/driver/routes" element={<DriverRoutes />} />
      <Route path="/dashboard/driver/students" element={<DriverStudents />} />
      <Route path="/dashboard/driver/schedule" element={<DriverSchedule />} />
      <Route path="/dashboard/driver/tracking" element={<DriverTracking />} />
      <Route path="/dashboard/driver/earnings" element={<DriverEarnings />} />
      <Route path="/dashboard/driver/messages" element={<DriverMessages />} />
      <Route path="/dashboard/driver/delays" element={<DriverDelays />} />
      <Route path="/dashboard/driver/feedback" element={<DriverFeedback />} />
      <Route path="/dashboard/driver/leaves" element={<DriverLeaves />} />
      <Route path="/dashboard/driver/vans" element={<DriverVans />} />

      {/* Admin Dashboard Routes */}
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/dashboard/admin/users" element={<AdminUsers />} />
      <Route path="/dashboard/admin/drivers" element={<AdminDrivers />} />
      <Route path="/dashboard/admin/vans" element={<AdminVans />} />
      <Route path="/dashboard/admin/routes" element={<AdminRoutes />} />
      <Route
        path="/dashboard/admin/verifications"
        element={<AdminVerifications />}
      />
      <Route path="/dashboard/admin/complaints" element={<AdminComplaints />} />
      <Route path="/dashboard/admin/reports" element={<AdminReports />} />

      {/* Guard Dashboard Routes */}
      <Route path="/dashboard/guard" element={<GuardDashboard />} />
      <Route path="/dashboard/guard/vans" element={<GuardVans />} />
      <Route path="/dashboard/guard/students" element={<GuardStudents />} />
      <Route path="/dashboard/guard/schedule" element={<GuardSchedule />} />
      <Route
        path="/dashboard/guard/verification"
        element={<GuardVerification />}
      />
      <Route path="/dashboard/guard/alerts" element={<GuardAlerts />} />
      <Route path="/dashboard/guard/reports" element={<GuardReports />} />

      {/* SHO Routes */}
      <Route path="/dashboard/police" element={<SHODashboard />} />
      <Route
        path="/dashboard/police/records"
        element={<SHOVerificationRecords />}
      />
      <Route path="/dashboard/police/violations" element={<SHOViolations />} />
      <Route path="/dashboard/police/reports" element={<SHOReports />} />

      {/* School Dashboard Routes  */}
      <Route path="/dashboard/school" element={<SchoolDashboard />} />
      <Route
        path="/dashboard/school/complaints"
        element={<SchoolComplaints />}
      />
      <Route
        path="/dashboard/school/complaints/:id"
        element={<SchoolComplaintDetail />}
      />
      <Route
        path="/dashboard/school/reports"
        element={<SchoolDriverReports />}
      />
      <Route path="/dashboard/school/guards" element={<SchoolGuards />} />
      <Route path="/dashboard/school/branches" element={<SchoolBranches />} />
    </Routes>
  );
}

export default App;
