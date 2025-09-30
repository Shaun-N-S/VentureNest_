import { Route, Routes } from 'react-router-dom'
import UserSignUpPage from '../pages/User/UserSignUpPage'
import UserLoginPage from '../pages/User/UserLoginPage'
import LandingPage from '../pages/LandingPages/LandingPage'
import Home from '../pages/Home/Home'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/signup' element={<UserSignUpPage />} />
            <Route path='/login' element={<UserLoginPage />} />
            <Route path='/home' element={<Home/>} />
        </Routes>
    )
}

export default UserRoutes