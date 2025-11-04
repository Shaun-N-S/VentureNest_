import toast from "react-hot-toast"
import { useInvestorResendOtp, useInvestorSignUp, useInvestorVerifyOtp } from "../../../hooks/Auth/AuthHooks"
import type { SignupPayload } from "../../../types/AuthPayloads"
import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import OTPModal from "../../../components/modals/OtpModal"
import SignUpForm from "../../../components/auth/SignUpForm"
import LeftPanel from "../../../components/auth/LeftPanal"
import { AxiosError } from "axios"

const InvestorSignUpPage = () => {

    const [investorData, setInvestorData] = useState<SignupPayload>({ userName: "", email: "", password: "" })
    const [isOtpModalOpen, setOtpModalOpen] = useState(false);
    const { mutate: signup } = useInvestorSignUp()
    const { mutate: verifyOtp } = useInvestorVerifyOtp()
    const { mutate: resendOtp } = useInvestorResendOtp()

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
                        console.log("Investor response : ; :", res.data);
                        toast.success("OTP Verified Successfully");
                        setOtpModalOpen(false);
                    }
                    navigate('/investor/login')
                },
                onError: (err) => {
                    console.log("Error while verifying otp", err);
                    if (err instanceof Error) {
                        // console.log("Error while verifying otp ", err.response.data.message);
                        toast.error(err.response.data.message)
                    }
                }
            }
        )
    }

    const handleResendOtp = (email: string) => {
        resendOtp(email, {
            onSuccess: (res) => {
                toast.success("OTP Resend successfully");
            },
            onError: (err) => {
                toast.error("Failed to resend OTP");
            }
        });
    }

    console.log("Investor data in state : ", investorData);

    return (
        <div className=" md:h-screen grid grid-cols-1 md:grid-cols-2 items-stretch bg-background text-foreground md:overflow-hidden">
            {/* <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 md:grid-cols-2"> */}
            {/* Left design panel - hidden on small screens for better mobile UX */}
            <motion.div
                // initial={{ opacity: 0, x: -16 }}
                // animate={{ opacity: 1, x: 0 }}
                // transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full"
            >
                {/* Replace previous image-based panel with reusable component */}
                <LeftPanel />
            </motion.div>

            {/* Right content: form card */}
            <div className="flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-lg md:p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-balance text-2xl font-semibold text-foreground md:text-3xl">
                            Create your VentureNest account
                        </h1>
                        <p className="mt-2 text-sm text-foreground/70">Join a community where innovation meets investment.</p>
                    </div>

                    <SignUpForm onSubmit={handleInvestorSignUp} />

                    <OTPModal
                        isOpen={isOtpModalOpen}
                        onClose={() => setOtpModalOpen(false)}
                        onVerify={handleVerifyOtp}
                        onResend={() => handleResendOtp(investorData.email)}
                    />

                    <p className="mt-6 text-center text-sm text-foreground/70">
                        Already have an account?{" "}
                        <Link to="/investor/login" className="font-medium text-primary underline-offset-4 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
            {/* </div> */}
        </div>
    )
}

export default InvestorSignUpPage