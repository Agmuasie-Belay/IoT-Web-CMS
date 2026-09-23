import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import AboutOverview from "./pages/about/AboutOverview";

// Contact pages 
import MainOffice from "./pages/contact/MainOffice";
import Departments from "./pages/contact/Departments";
import QuickCards from "./pages/contact/QuickCards";
import CampusAddress from "./pages/contact/CampusAddress";
import OfficeHours from "./pages/contact/OfficeHours";
import Submissions from "./pages/contact/Submissions";

// Footer pages 
import FooterNavigation from "./pages/footer/FooterNavigation";
import FooterSocialLinks from "./pages/footer/FooterSocialLinks";
import FooterContactInfo from "./pages/footer/FooterContactInfo";

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
{/* Contact */}
          <Route path="contact/main-office" element={<MainOffice />} />
          <Route path="contact/departments" element={<Departments />} />
          <Route path="contact/quick-cards" element={<QuickCards />} />
          <Route path="contact/campus-address" element={<CampusAddress />} />
          <Route path="contact/office-hours" element={<OfficeHours />} />
          <Route path="contact/submissions" element={<Submissions />} />

          {/* Footer */}
          <Route path="footer/navigation" element={<FooterNavigation />} />
          <Route path="footer/social-links" element={<FooterSocialLinks />} />
          <Route path="footer/contact-info" element={<FooterContactInfo />} />
      

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