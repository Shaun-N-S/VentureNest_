import LoginForm, { type LoginFormData } from "../../components/auth/LoginForm";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUserLogin } from "../../hooks/AuthHooks";
import { useDispatch } from "react-redux";
import { setData } from "../../store/Slice/userSlice/authDataSlice";

const UserLoginPage = () => {

    const { mutate: login } = useUserLogin();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleUserLogin = (values: LoginFormData) => {
        console.log("Login values:", values);
        toast.success("Login attempted!");
        login(values, {
            onSuccess: (res) => {
                console.log("login successfull , ", res.data);
                dispatch(setData(res.data))
                navigate('/home')
            },
            onError: (err) => {
                console.log("Error while login ,", err)
            }
        })
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back 👋
                </h2>

                {/* Reusable form */}
                <LoginForm onSubmit={handleUserLogin} />

                {/* Footer / Signup link */}
                <p className="text-center text-gray-500 mt-6 text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>

                {/* Extra Options */}
                <div className="flex justify-between text-sm mt-3">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600" />
                        Remember me
                    </label>
                    <a href="#" className="text-indigo-600 hover:underline">
                        Forgot password?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UserLoginPage;
