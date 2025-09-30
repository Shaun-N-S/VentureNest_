import { Link, useNavigate } from "react-router-dom";
import SignupForm, { type SignupFormValues } from "../../components/auth/SignUpForm";
import { useUserSignUp, useUserVerifyOtp } from "../../hooks/AuthHooks";
import toast from "react-hot-toast";
import OTPModal from "../../components/modals/OtpModal";
import { useState } from "react";
import type { SignupPayload } from "../../types/AuthPayloads";
// import { useSelector } from "react-redux";

export default function UserSignUpPage() {

    const [isOtpModalOpen, setOtpModalOpen] = useState(false);
    const [userData,setUserData] = useState<SignupPayload>({email:"",password:"",userName:""})
    const { mutate: signup } = useUserSignUp();
    const { mutate: verifyOtp } = useUserVerifyOtp()
    const navigate = useNavigate();

    const handleUserSignUp = (values: SignupFormValues) => {
        const payload = {
            userName: values.userName,
            email: values.email,
            password: values.password,
        };

        signup(payload, {
            onSuccess: (res) => {
                console.log("Signup successful:", res);
                toast.success("Account created successfully!");
                setUserData(payload)
                if (res.message === "Otp sent successfully") {
                    setOtpModalOpen(true)
                }
            },
            onError: (err) => {
                console.log("Signup error:", err);
                toast.error((err as Error).message || "Something went wrong!");
            },
        });
    };

    const handleVerifyOtp = (otp: string) => {
        console.log(userData)
        verifyOtp(
            { otp, values:userData },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        console.log("Otp verified succesfully , :", res.data);
                        setOtpModalOpen(false);
                    }
                    navigate('/login')

                }, onError: (err) => {
                    console.error("Error while verifying otp ", err);
                }
            }
        )
    }




    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Create Your Account</h1>
                    <p className="text-gray-500 mt-2">
                        Sign up to get started with our awesome platform
                    </p>
                </div>

                {/* Signup Form */}
                <SignupForm onSubmit={handleUserSignUp} />

                {/* <OTPModal isOpen={isOtpModalOpen} onClose={() => setOtpModalOpen(false)} onVerify={handleVerifyModal} /> */}
                <OTPModal isOpen={isOtpModalOpen} onClose={() => setOtpModalOpen(false)} onVerify={handleVerifyOtp} />

                {/* Footer / Login Link */}
                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
