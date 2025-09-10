import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./auth/Login";
import { Registration } from "./auth/Registration";
import { AdminDashboard } from "./pages/AdminPage/AdminDashboard";
import { AdminReports } from "./pages/AdminPage/AdminReports";
import { Unauthorize } from "./pages/Unauthorize";
import { BoardingDashboard } from "./pages/PetBoardingPage/BoardingDashboard";
import { BoardingReports } from "./pages/PetBoardingPage/BoardingReports";
import { AuthProvider } from "./context/AuthProvider";
import { AuthRoute } from "./context/AuthRoute";
import { FacilityProfile } from "./pages/PetBoardingPage/FacilityProfile";
import { ManageUser } from "./pages/AdminPage/ManageUser";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { VerificationPage } from "./auth/VerificationPage";
// import { PendingProvider } from "./pages/PendingProvider";
import { ForgotPasswordProvider } from "./context/ForgotPasswordProvider";
import {
  ForgotPassword,
  VerifyCode,
  ResetPassword,
} from "./auth/ForgotPassword";
import { BookingPage } from "./pages/PetBoardingPage/BookingPage";
import { ReviewsPage } from "./pages/PetBoardingPage/ReviewsPage";
import { ChatsPage } from "./pages/PetBoardingPage/ChatsPage";
import { SubscriptionPage } from "./pages/PetBoardingPage/SubscriptionPage";
import { ProfilePage } from "./pages/PetBoardingPage/ProfilePage";

export const ROLES = {
  ADMIN: "Admin",
  BOARDING: "Boarding",
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ForgotPasswordProvider>
          <Routes>
            {/* Auth Route */}
            <Route
              path="/"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <Registration />
                </AuthRoute>
              }
            />
            {/* <Route path="/pending_providers" element={<PendingProvider />} /> */}
            <Route path="/unauthorized" element={<Unauthorize />} />
            <Route path="/verify" element={<VerificationPage />} />

            <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route
              path="/Admin/Dashboard"
              element={
                <ProtectedRoute allowedRoles={ROLES.ADMIN}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/Admin/Reports" element={<AdminReports />} />
            <Route path="/Admin/ManageUsers" element={<ManageUser />} />

            {/* Pet Boarding Routes */}
            <Route
              path="/Petboarding/Dashboard"
              element={
                <ProtectedRoute allowedRoles={ROLES.BOARDING}>
                  <BoardingDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Petboarding/Reports"
              element={
                <ProtectedRoute allowedRoles={ROLES.BOARDING}>
                  <BoardingReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Petboarding/FacilityProfile"
              element={
                <ProtectedRoute allowedRoles={ROLES.BOARDING}>
                  <FacilityProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Petboarding/Bookings"
              element={
                <ProtectedRoute allowedRoles={ROLES.BOARDING}>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Petboarding/Reviews&Ratings"
              element={
                <ProtectedRoute allowedRoles={ROLES.BOARDING}>
                  <ReviewsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Petboarding/Chats"
              element={
                <ProtectedRoute allowedRoles={ROLES.BOARDING}>
                  <ChatsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Petboarding/Subscription"
              element={
                <ProtectedRoute allowedRoles={ROLES.BOARDING}>
                  <SubscriptionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Petboarding/ProfilePage"
              element={
                <ProtectedRoute allowedRoles={ROLES.BOARDING}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ForgotPasswordProvider>
      </AuthProvider>
    </Router>
  );
}
