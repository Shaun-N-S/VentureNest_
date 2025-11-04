import { Route, Routes } from "react-router-dom";
import { FRONTEND_ROUTES } from "../constants/frontendRoutes";
import ProtectedLogin from "../components/protectedComponents/ProtectedLogin";
import ProtectedRoute from "../components/protectedComponents/ProtectedRoute";
import Home from "../pages/Home/Home";
import InvestorProfileCompletion from "../pages/Investor/Profile/ProfileCompletion/InvestorProfileCompletion";
import InvestorSignUpPage from "../pages/Investor/Auth/InvestorSignUpPage";
import InvestorLoginPage from "../pages/Investor/Auth/InvestorLoginPage";
import ForgotPasswordPage from "../pages/Investor/Auth/InvestorFogetPassword";

const InvestorRoutes = () => {
    return (
        <Routes>
            <Route path={FRONTEND_ROUTES.INVESTOR.SIGNUP} element={<ProtectedLogin><InvestorSignUpPage /></ProtectedLogin>} />
            <Route path={FRONTEND_ROUTES.INVESTOR.LOGIN} element={<ProtectedLogin><InvestorLoginPage /></ProtectedLogin>} />
            <Route path={FRONTEND_ROUTES.INVESTOR.FORGOT_PASSWORD} element={<ProtectedLogin><ForgotPasswordPage /></ProtectedLogin>} />
            <Route path={FRONTEND_ROUTES.INVESTOR.PROFILE_COMPLETION} element={<InvestorProfileCompletion />} />
            <Route path={FRONTEND_ROUTES.INVESTOR.HOME} element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
    );
};

export default InvestorRoutes;
