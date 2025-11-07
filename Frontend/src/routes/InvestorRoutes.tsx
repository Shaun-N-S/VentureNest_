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
                    <Route
                        path={FRONTEND_ROUTES.INVESTOR.HOME}
                        element={<Home />}
                    />
                    <Route
                        path={FRONTEND_ROUTES.INVESTOR.PROFILE}
                        element={<ProfilePage />}
                    />
                </Route>

                <Route
                    path={FRONTEND_ROUTES.INVESTOR.PROFILE_COMPLETION}
                    element={<InvestorProfileCompletion />}
                />
            </Route>
        </Routes>
    );
};

export default InvestorRoutes;
