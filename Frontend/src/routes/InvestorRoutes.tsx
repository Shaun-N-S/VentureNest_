import { Route, Routes } from "react-router-dom"
import InvestorSignUpPage from "../pages/Investor/InvestorSignUpPage"
import InvestorLoginPage from "../pages/Investor/InvestorLoginPage"
import ProtectedLogin from "../components/protectedComponents/ProtectedLogin"
import ProtectedRoute from "../components/protectedComponents/ProtectedRoute"
import Home from "../pages/Home/Home"

const InvestorRoutes = () => {
    return (
        <Routes>
            <Route path='/signup' element={<ProtectedLogin><InvestorSignUpPage /></ProtectedLogin>} />
            <Route path="/login" element={<ProtectedLogin><InvestorLoginPage /></ProtectedLogin>} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
    )
}

export default InvestorRoutes