import toast from "react-hot-toast"
import LoginForm, { type LoginFormData } from "../../components/auth/LoginForm"
import { useInvestorLogin } from "../../hooks/AuthHooks"
import { useDispatch } from "react-redux"
import { setData } from "../../store/Slice/authDataSlice"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { setToken } from "../../store/Slice/tokenSlice"

const InvestorLoginPage = () => {


    const { mutate: login } = useInvestorLogin()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInvestorLogin = (values: LoginFormData) => {
        login(values, {
            onSuccess: (res) => {
                console.log("Investor login successfull :", res.data);
                toast.success("Login Successfull");
                dispatch(setData(res.data))
                dispatch(setToken(res.data.accessToken))
                navigate('/home');
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    const errMsg = err.response?.data?.message;
                    console.log("Error while login ,", err)
                    toast.error(errMsg)
                }
            }
        })
    }

    return (
        <div>
            <LoginForm onSubmit={handleInvestorLogin} />
        </div>
    )
}

export default InvestorLoginPage