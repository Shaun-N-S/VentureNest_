import { Route, Routes } from "react-router-dom";
import { FRONTEND_ROUTES } from "../constants/frontendRoutes";
import UserSignUpPage from "../pages/User/Auth/UserSignUpPage";
import UserLoginPage from "../pages/User/Auth/UserLoginPage";
import LandingPage from "../pages/LandingPages/LandingPage";
import Home from "../pages/Home/Home";
import ProtectedRoute from "../components/protectedComponents/ProtectedRoute";
import ProtectedLogin from "../components/protectedComponents/ProtectedLogin";
import ForgotPasswordPage from "../pages/User/Auth/UserForgetPassword";
import UserLayout from "../layouts/UserLayout";
import ProfilePage from "../pages/User/Profile/UserProfile";
import MyNetworkPage from "../pages/Common/MyNetworkPage";
import NotificationPage from "../pages/Common/NotificationPage";
import ProjectPage from "../pages/Common/ProjectPage";
import ProjectDetailedPage from "../pages/Common/ProjectDetailedPage";
import PlansPage from "../pages/Common/PlanPage";
import PaymentSuccess from "../pages/Common/PaymentSuccess";
import CommonProfilePage from "../pages/Common/ProfilePage";
import MySessionsPage from "../pages/Common/MySessionPage";

const UserRoutes = () => {
  return (
    <Routes>
      {/*Public route */}
      <Route path={FRONTEND_ROUTES.LANDING} element={<LandingPage />} />

      {/*Routes visible only when user is NOT logged in */}
      <Route element={<ProtectedLogin />}>
        <Route
          path={FRONTEND_ROUTES.USER.SIGNUP}
          element={<UserSignUpPage />}
        />
        <Route path={FRONTEND_ROUTES.USER.LOGIN} element={<UserLoginPage />} />
        <Route
          path={FRONTEND_ROUTES.USER.FORGOT_PASSWORD}
          element={<ForgotPasswordPage />}
        />
      </Route>

      {/*Protected routes (visible only when logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path={FRONTEND_ROUTES.USER.HOME} element={<Home />} />
          <Route
            path={FRONTEND_ROUTES.USER.PROFILE}
            element={<ProfilePage />}
          />
          <Route
            path={FRONTEND_ROUTES.USER.MYNETWORK}
            element={<MyNetworkPage />}
          />
          <Route
            path={FRONTEND_ROUTES.USER.NOTIFICATIONS}
            element={<NotificationPage />}
          />
          <Route
            path={FRONTEND_ROUTES.USER.PROJECT}
            element={<ProjectPage />}
          />
          <Route
            path={`${FRONTEND_ROUTES.USER.PROJECT}/:id`}
            element={<ProjectDetailedPage />}
          />
          <Route
            path={`${FRONTEND_ROUTES.USER.PLANS}`}
            element={<PlansPage />}
          />
          <Route
            path={FRONTEND_ROUTES.USER.PAYMENT_SUCCESS}
            element={<PaymentSuccess />}
          />
          <Route
            path={FRONTEND_ROUTES.USER.COMMON_PROFILE}
            element={<CommonProfilePage />}
          />
          <Route
            path={FRONTEND_ROUTES.USER.SESSIONS}
            element={<MySessionsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;
