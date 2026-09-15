import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import AboutOverview from "./pages/about/AboutOverview";

import ProtectedRoute from "./routes/ProtectedRoutes";

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route
        path="/cms/login"
        element={<Login />}
      />

      {/* Protected CMS */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/cms"
          element={<AdminLayout />}
        >
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="about/overview"
            element={<AboutOverview />}
          />
        </Route>
      </Route>

      {/* Root */}
      <Route
        path="/"
        element={
          <Navigate
            to="/cms"
            replace
          />
        }
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={
          <Navigate
            to="/cms"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;