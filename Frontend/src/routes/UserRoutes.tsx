import { Route, Routes } from 'react-router-dom'
import UserSignUpPage from '../pages/User/UserSignUpPage'
import UserLoginPage from '../pages/User/UserLoginPage'
import LandingPage from '../pages/LandingPages/LandingPage'
import Home from '../pages/Home/Home'
import ProtectedRoute from '../components/protectedComponents/ProtectedRoute'
import ProtectedLogin from '../components/protectedComponents/ProtectedLogin'
import ForgotPasswordPage from '../pages/User/UserForgetPassword'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/signup' element={<ProtectedLogin><UserSignUpPage /></ProtectedLogin>} />
            <Route path='/login' element={<ProtectedLogin><UserLoginPage /></ProtectedLogin>} />
            <Route path='/forgot-password' element={<ProtectedLogin><ForgotPasswordPage /></ProtectedLogin>}/>
            <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
    )
}

export default UserRoutes