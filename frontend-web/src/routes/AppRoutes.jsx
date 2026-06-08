import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import AdminPage from "../pages/AdminPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import ReportsPage from "../pages/ReportsPage";
import UsersPage from "../pages/UsersPage";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute roles={["admin"]}><AdminPage /></ProtectedRoute>
      } />

      <Route path="/analytics" element={
        <ProtectedRoute roles={["admin"]}><AnalyticsPage /></ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute roles={["admin"]}><ReportsPage /></ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute roles={["admin"]}><UsersPage /></ProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;