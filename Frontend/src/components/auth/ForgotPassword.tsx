import React, { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import LeftPanel from "../../components/auth/LeftPanal"
import toast from "react-hot-toast"

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")

  // Step 1: Send Email
  const handleEmailSubmit = async () => {
    try {
      await axios.post("/api/send-otp", { email })
      toast.success("OTP sent to your email")
      setStep(2)
    } catch (error) {
      console.log(error)
      setStep(2)
      toast.error("Failed to send OTP")
    }
  }

  // Step 2: Verify OTP
  const handleOtpSubmit = async () => {
    try {
      const res = await axios.post("/api/verify-otp", { email, otp })
      setToken(res.data.token)
      toast.success("OTP verified")
      setStep(3)
    } catch (error) {
        setStep(3)
      console.log(error)
      toast.error("Invalid OTP")
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    try {
      await axios.post("/api/reset-password", { token, newPassword })
      toast.success("Password reset successfully")
      setStep(1)
      setEmail("")
      setOtp("")
      setNewPassword("")
      setToken("")
    } catch (error) {
      console.log(error)
      toast.error("Failed to reset password")
    }
  }

  return (
    <div className="min-h-screen md:h-screen grid grid-cols-1 md:grid-cols-2 items-stretch bg-background text-foreground md:overflow-hidden">
      {/* Left visual panel */}
      <motion.div className="relative h-full">
        <LeftPanel />
      </motion.div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-6 py-10 sm:px-8 md:px-10 md:py-0 min-h-screen md:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-xl shadow-black/5">
            {/* Header */}
            <div className="px-6 pt-6 pb-3">
              <h1 className="text-2xl font-semibold tracking-tight text-pretty">
                {step === 1 && "Forgot Password"}
                {step === 2 && "Verify OTP"}
                {step === 3 && "Reset Password"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {step === 1 && "Enter your email to receive OTP"}
                {step === 2 && `Enter OTP sent to ${email}`}
                {step === 3 && "Set your new password"}
              </p>
            </div>

            {/* Form */}
            <div className="px-6 pb-4">
              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-md border border-border px-4 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleEmailSubmit}
                    className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  >
                    Send OTP
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="rounded-md border border-border px-4 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleOtpSubmit}
                    className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-md border border-border px-4 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleResetPassword}
                    className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  >
                    Reset Password
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 text-sm text-muted-foreground text-center">
              Remember your password?{" "}
              <a href="/login" className="text-primary font-medium hover:underline">
                Login
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
