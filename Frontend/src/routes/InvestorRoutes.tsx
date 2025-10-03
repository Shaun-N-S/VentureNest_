import { Route, Routes } from "react-router-dom"
import InvestorSignUpPage from "../pages/Investor/InvestorSignUpPage"
import InvestorLoginPage from "../pages/Investor/InvestorLoginPage"

const InvestorRoutes = () => {
    return (
        <Routes>
            <Route path='/signup' element={<InvestorSignUpPage />} />
            <Route path="/login" element={<InvestorLoginPage />} />
        </Routes>
    )
}

export default InvestorRoutes