import { Route, Routes } from "react-router-dom";
import { FRONTEND_ROUTES } from "../constants/frontendRoutes";
import AdminLoginPage from "../pages/Admin/AdminLoginPage";
import ProtectedLogin from "../components/protectedComponents/ProtectedLogin";
import ProtectedRoute from "../components/protectedComponents/ProtectedRoute";
import Dashboard from "../pages/Admin/Dashboard";
import UsersListing from "../pages/Admin/UsersListing";
import InvestorsListing from "../pages/Admin/InvestorListing";
import AdminLayout from "../layouts/AdminLayout";
import VerificationPage from "../pages/Admin/verificationListing";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Admin login route */}
      <Route element={<ProtectedLogin />}>
        <Route path={FRONTEND_ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />
      </Route>

      {/* Protected Admin routes with layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path={FRONTEND_ROUTES.ADMIN.DASHBOARD} element={<Dashboard />} />
          <Route path={FRONTEND_ROUTES.ADMIN.USERS} element={<UsersListing />} />
          <Route path={FRONTEND_ROUTES.ADMIN.INVESTORS} element={<InvestorsListing />} />
          <Route path={FRONTEND_ROUTES.ADMIN.VERIFICATIONS} element={<VerificationPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
