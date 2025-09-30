import { useNavigate } from "react-router-dom"

const LandingPage = () => {

    const navigate = useNavigate();

    const handleUserSignup = () => {
        navigate('/signup')
    }

    return (
        <div>
            <h1>Landing Page</h1>
            <div className="flex ">
                <button className="bg-amber-300 h-16 w-28 rounded-2xl mr-3" onClick={handleUserSignup}>Join as user</button>
                <button className="bg-green-600 h-16 w-32 rounded-2xl">Join as investor</button>
            </div>
        </div>
    )
}

export default LandingPage