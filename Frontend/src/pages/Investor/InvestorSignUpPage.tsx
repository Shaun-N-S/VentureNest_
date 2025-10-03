import toast from "react-hot-toast"
import SignupForm from "../../components/auth/SignUpForm"
import { useInvestorSignUp, useInvestorVerifyOtp } from "../../hooks/AuthHooks"
import type { SignupPayload } from "../../types/AuthPayloads"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import OTPModal from "../../components/modals/OtpModal"

const InvestorSignUpPage = () => {

    const [investorData, setInvestorData] = useState<SignupPayload>({ userName: "", email: "", password: "" })
    const [isOtpModalOpen, setOtpModalOpen] = useState(false);
    const { mutate: signup } = useInvestorSignUp()
    const { mutate: verifyOtp } = useInvestorVerifyOtp()

    const navigate = useNavigate()

    const handleInvestorSignUp = (values: SignupPayload) => {
        const payload = {
            userName: values.userName,
            email: values.email,
            password: values.password,
        };

        signup(payload, {
            onSuccess: (res) => {
                console.log("Signup otp sent Successfull : ", res);
                setInvestorData(payload);
                if (res.message === "Otp sent successfully") {
                    setOtpModalOpen(true);
                }
            },
            onError: (err) => {
                console.log("signup error :", err);
                // toast.error(err.response?.data?.message)
            }
        })
    }

    const handleVerifyOtp = (otp: string) => {
        verifyOtp(
            { otp, values: investorData },
            {
                onSuccess: (res) => {
                    if (res) {
                        console.log("Investor response : ; :",res.data);
                        toast.success("OTP Verified Successfully");
                        setOtpModalOpen(false);
                    }
                    navigate('/investors/login')
                },
                onError: (err) => {
                    console.error("Error while verifying otp", err);
                }
            }
        )
    }

    console.log("Investor data in state : ", investorData);

    return (
        <div>
            <SignupForm onSubmit={handleInvestorSignUp} />

            <OTPModal isOpen={isOtpModalOpen} onClose={()=>setOtpModalOpen(false)} onVerify={handleVerifyOtp} />

        </div>
    )
}

export default InvestorSignUpPage