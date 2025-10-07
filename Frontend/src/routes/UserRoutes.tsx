import { Route, Routes } from "react-router-dom";
import { FRONTEND_ROUTES } from "../constants/frontendRoutes";
import UserSignUpPage from "../pages/User/UserSignUpPage";
import UserLoginPage from "../pages/User/UserLoginPage";
import LandingPage from "../pages/LandingPages/LandingPage";
import Home from "../pages/Home/Home";
import ProtectedRoute from "../components/protectedComponents/ProtectedRoute";
import ProtectedLogin from "../components/protectedComponents/ProtectedLogin";
import ForgotPasswordPage from "../pages/User/UserForgetPassword";

const UserRoutes = () => {
    return (
        <Routes>
            <Route path={FRONTEND_ROUTES.LANDING} element={<LandingPage />} />
            <Route path={FRONTEND_ROUTES.USER.SIGNUP} element={<ProtectedLogin><UserSignUpPage /></ProtectedLogin>} />
            <Route path={FRONTEND_ROUTES.USER.LOGIN} element={<ProtectedLogin><UserLoginPage /></ProtectedLogin>} />
            <Route path={FRONTEND_ROUTES.USER.FORGOT_PASSWORD} element={<ProtectedLogin><ForgotPasswordPage /></ProtectedLogin>} />
            <Route path={FRONTEND_ROUTES.USER.HOME} element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
    );
};

export default UserRoutes;
