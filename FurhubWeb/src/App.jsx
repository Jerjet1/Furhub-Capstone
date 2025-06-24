import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { Registration } from "./pages/Registration";
import { AdminDashboard } from "./pages/AdminPage/AdminDashboard";
import { AdminReports } from "./pages/AdminPage/AdminReports";
import { BoardingDashboard } from "./pages/PetBoardingPage/BoardingDashboard";
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Route */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Admin Routes */}
        <Route path="/Admin/Dashboard" element={<AdminDashboard />} />
        <Route path="/Admin/Reports" element={<AdminReports />} />

        {/* Pet Boarding Routes */}
        <Route path="/Petboarding/Dashboard" element={<BoardingDashboard />} />
      </Routes>
    </Router>
  );
}
