import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./auth/Login";
import { Registration } from "./auth/Registration";
import { Unauthorize } from "./pages/Unauthorize";
import { BoardingReports } from "./pages/PetBoardingPage/BoardingReports";
import { AuthProvider } from "./context/AuthProvider";
import { AuthRoute } from "./context/AuthRoute";
import { FacilityProfile } from "./pages/PetBoardingPage/FacilityProfile";
import { ManageUser } from "./pages/AdminPage/ManageUser";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { VerificationPage } from "./auth/VerificationPage";
import { ForgotPasswordProvider } from "./context/ForgotPasswordProvider";
import { ProfileProvider } from "./context/ProfileProvider";
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
import { AdminProfilePage } from "./pages/AdminPage/AdminProfilePage";
import { ManageLocation } from "./pages/AdminPage/ManageLocation";
import { AdminSubscription } from "./pages/AdminPage/AdminSubscription";

export const ROLES = {
  ADMIN: "Admin",
  BOARDING: "Boarding",
};

const AdminRoute = () => {
  return (
    <ProtectedRoute allowedRoles={ROLES.ADMIN}>
      <ProfileProvider>
        <Routes>
          <Route path="ManageLocation" element={<ManageLocation />} />
          {/* <Route path="Reports" element={<AdminReports />} /> */}
          <Route path="ManageUsers" element={<ManageUser />} />
          <Route path="Subscription" element={<AdminSubscription />} />
          <Route path="ProfilePage" element={<AdminProfilePage />} />
        </Routes>
      </ProfileProvider>
    </ProtectedRoute>
  );
};

const PetBoardingRoute = () => {
  return (
    <ProtectedRoute allowedRoles={ROLES.BOARDING}>
      <ProfileProvider>
        <Routes>
          <Route path="Reports" element={<BoardingReports />} />
          <Route path="FacilityProfile" element={<FacilityProfile />} />
          <Route path="Bookings" element={<BookingPage />} />
          <Route path="Reviews&Ratings" element={<ReviewsPage />} />
          <Route path="Chats" element={<ChatsPage />} />
          <Route path="Subscription" element={<SubscriptionPage />} />
          <Route path="ProfilePage" element={<ProfilePage />} />
        </Routes>
      </ProfileProvider>
    </ProtectedRoute>
  );
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
            <Route path="/unauthorized" element={<Unauthorize />} />
            <Route path="/verify" element={<VerificationPage />} />

            <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/Admin/*" element={<AdminRoute />} />
            <Route path="/Petboarding/*" element={<PetBoardingRoute />} />
          </Routes>
        </ForgotPasswordProvider>
      </AuthProvider>
    </Router>
  );
}
