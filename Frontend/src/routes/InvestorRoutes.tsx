import { Route, Routes } from "react-router-dom";
import { FRONTEND_ROUTES } from "../constants/frontendRoutes";
import ProtectedLogin from "../components/protectedComponents/ProtectedLogin";
import ProtectedRoute from "../components/protectedComponents/ProtectedRoute";
import Home from "../pages/Home/Home";
import InvestorProfileCompletion from "../pages/Investor/Profile/ProfileCompletion/InvestorProfileCompletion";
import InvestorSignUpPage from "../pages/Investor/Auth/InvestorSignUpPage";
import InvestorLoginPage from "../pages/Investor/Auth/InvestorLoginPage";
import ForgotPasswordPage from "../pages/Investor/Auth/InvestorFogetPassword";
import ProfilePage from "../pages/Investor/Profile/InvestorProfile/ProfilePage";
import InvestorLayout from "../layouts/InvestorLayout";
import MyNetworkPage from "../pages/Common/MyNetworkPage";
import NotificationPage from "../pages/Common/NotificationPage";
import ProjectPage from "../pages/Common/ProjectPage";
import ProjectDetailedPage from "../pages/Common/ProjectDetailedPage";
import PaymentSuccess from "../pages/Common/PaymentSuccess";
import PlansPage from "../pages/Common/PlanPage";
import CommonProfilePage from "../pages/Common/ProfilePage";
import BookSessionPage from "../pages/Investor/BookSessionPage";
import MySessionsPage from "../pages/Common/MySessionPage";

const InvestorRoutes = () => {
  return (
    <Routes>
      {/*Public (login-related) routes */}
      <Route element={<ProtectedLogin />}>
        <Route
          path={FRONTEND_ROUTES.INVESTOR.SIGNUP}
          element={<InvestorSignUpPage />}
        />
        <Route
          path={FRONTEND_ROUTES.INVESTOR.LOGIN}
          element={<InvestorLoginPage />}
        />
        <Route
          path={FRONTEND_ROUTES.INVESTOR.FORGOT_PASSWORD}
          element={<ForgotPasswordPage />}
        />
      </Route>

      {/*Protected investor routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<InvestorLayout />}>
          <Route path={FRONTEND_ROUTES.INVESTOR.HOME} element={<Home />} />
          <Route
            path={FRONTEND_ROUTES.INVESTOR.PROFILE}
            element={<ProfilePage />}
          />
          <Route
            path={FRONTEND_ROUTES.INVESTOR.PROFILE_COMPLETION}
            element={<InvestorProfileCompletion />}
          />
          <Route
            path={FRONTEND_ROUTES.INVESTOR.MYNETWORK}
            element={<MyNetworkPage />}
          />
          <Route
            path={FRONTEND_ROUTES.INVESTOR.NOTIFICATIONS}
            element={<NotificationPage />}
          />
          <Route
            path={FRONTEND_ROUTES.INVESTOR.PROJECT}
            element={<ProjectPage />}
          />
          <Route
            path={`${FRONTEND_ROUTES.INVESTOR.PROJECT}/:id`}
            element={<ProjectDetailedPage />}
          />
          <Route
            path={`${FRONTEND_ROUTES.INVESTOR.PLANS}`}
            element={<PlansPage />}
          />
          <Route
            path={`${FRONTEND_ROUTES.INVESTOR.PAYMENT_SUCCESS}`}
            element={<PaymentSuccess />}
          />
          <Route
            path={FRONTEND_ROUTES.USER.COMMON_PROFILE}
            element={<CommonProfilePage />}
          />
          <Route
            path={`${FRONTEND_ROUTES.INVESTOR.BOOK_SESSION}/:id`}
            element={<BookSessionPage />}
          />
          <Route
            path={FRONTEND_ROUTES.INVESTOR.SESSIONS}
            element={<MySessionsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default InvestorRoutes;
