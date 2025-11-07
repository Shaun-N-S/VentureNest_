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
                <Route
                    path={FRONTEND_ROUTES.USER.LOGIN}
                    element={<UserLoginPage />}
                />
                <Route
                    path={FRONTEND_ROUTES.USER.FORGOT_PASSWORD}
                    element={<ForgotPasswordPage />}
                />
            </Route>

            {/*Protected routes (visible only when logged in) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<UserLayout />}>
                    <Route
                        path={FRONTEND_ROUTES.USER.HOME}
                        element={<Home />}
                    />
                    <Route path={FRONTEND_ROUTES.USER.PROFILE} element={<ProfilePage />} />

                </Route>
            </Route>
        </Routes>
    );
};

export default UserRoutes;
