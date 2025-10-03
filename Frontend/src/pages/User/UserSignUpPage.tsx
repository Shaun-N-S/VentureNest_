import { Link, useNavigate } from "react-router-dom"
import SignUpForm, { type SignupFormValues } from "../../components/auth/SignUpForm"
import { useUserResendOtp, useUserSignUp, useUserVerifyOtp } from "../../hooks/AuthHooks"
import OTPModal from "../../components/modals/OtpModal"
import { useState } from "react"
import LeftPanel from "../../components/auth/LeftPanal"
import toast from "react-hot-toast"
import { motion } from "framer-motion"


type SignupPayload = { userName: string; email: string; password: string }

export default function UserSignUpPage() {
  const [isOtpModalOpen, setOtpModalOpen] = useState(false)
  const [userData, setUserData] = useState<SignupPayload>({ email: "", password: "", userName: "" })

  const { mutate: signup } = useUserSignUp()
  const { mutate: verifyOtp } = useUserVerifyOtp()
  const { mutate: resendOtp } = useUserResendOtp();
  const navigate = useNavigate()

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
      { otp, email: userData.email },
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


  const handleResendOtp = (email: string) => {
    console.log("Sending resend OTP...",email);
    resendOtp(email, {
      onSuccess: (res) => {
        console.log("response from resend otp :", res);
        toast.success("OTP Resent successfully");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Failed to resend OTP");
      },
    });
  };

  return (
    <div className=" md:h-screen grid grid-cols-1 md:grid-cols-2 items-stretch bg-background text-foreground md:overflow-hidden">
      {/* <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 md:grid-cols-2"> */}
      {/* Left design panel - hidden on small screens for better mobile UX */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

          <SignUpForm onSubmit={handleUserSignUp} />

          <OTPModal
            isOpen={isOtpModalOpen}
            onClose={() => setOtpModalOpen(false)}
            onVerify={handleVerifyOtp}
            onResend={() => handleResendOtp(userData.email)}
          />

          <p className="mt-6 text-center text-sm text-foreground/70">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      {/* </div> */}
    </div>
  )
}
