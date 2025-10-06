import { Route, Routes } from "react-router-dom";
import { FRONTEND_ROUTES } from "../constants/frontendRoutes";
import AdminLoginPage from "../pages/Admin/AdminLoginPage";
import ProtectedLogin from "../components/protectedComponents/ProtectedLogin";
import ProtectedRoute from "../components/protectedComponents/ProtectedRoute";
import Dashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users";
import Investors from "../pages/Admin/Investors";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path={FRONTEND_ROUTES.ADMIN.LOGIN} element={<ProtectedLogin><AdminLoginPage /></ProtectedLogin>} />
      <Route path={FRONTEND_ROUTES.ADMIN.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path={FRONTEND_ROUTES.ADMIN.USERS} element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path={FRONTEND_ROUTES.ADMIN.INVESTORS} element={<ProtectedRoute><Investors /></ProtectedRoute>} />
    </Routes>
  );
};

export default AdminRoutes;
