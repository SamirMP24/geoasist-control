import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LoginPage
from "../pages/LoginPage";

import DashboardPage
from "../pages/DashboardPage";

import AdminPage
from "../pages/AdminPage";

import AnalyticsPage
from "../pages/AnalyticsPage";

import ProtectedRoute
from "../components/ProtectedRoute";

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;