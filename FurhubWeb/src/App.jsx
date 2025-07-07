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

export const ROLES = {
  ADMIN: "Admin",
  BOARDING: "Boarding",
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
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
          <Route path="/unauthorize" element={<Unauthorize />} />

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
        </Routes>
      </AuthProvider>
    </Router>
  );
}
