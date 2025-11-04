import { useState } from "react";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import LeftPanel from "../../../components/auth/LeftPanal";
import toast from "react-hot-toast";
import {
  useForgetPasswordInvestorResetPassword,
  useForgetPasswordVerifyOtp,
  useUserForgetPassword,
} from "../../../hooks/Auth/AuthHooks";
import z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";


const EmailSchema = z.object({
  email: z.email("Enter a valid email address"),
});

const OtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one symbol"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type EmailFormData = z.infer<typeof EmailSchema>;
type OtpFormData = z.infer<typeof OtpSchema>;
type PasswordFormData = z.infer<typeof PasswordSchema>;

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate()

  const { mutate: forgetpasswordEmail } = useUserForgetPassword();
  const { mutate: forgetpasswordVerifyOtp } = useForgetPasswordVerifyOtp();
  const { mutate: forgetPasswordInvestorResetPassword } = useForgetPasswordInvestorResetPassword();


  const handleEmailSubmit = async () => {
    const result = EmailSchema.safeParse({ email });
    if (!result.success) {
      setErrors({ email: result.error.issues[0].message });
      return;
    }
    setErrors({});
    forgetpasswordEmail(email, {
      onSuccess: (res) => {
        toast.success("OTP sent successfully");
        setStep(2);
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          console.log(err);
          toast.error(err.response?.data?.message);
        }

      },
    });
  };


  const handleOtpSubmit = async () => {
    const result = OtpSchema.safeParse({ otp });
    if (!result.success) {
      setErrors({ otp: result.error.issues[0].message });
      return;
    }
    setErrors({});
    forgetpasswordVerifyOtp({ email, otp }, {
      onSuccess: (res) => {
        setToken(res.data);
        setStep(3);
        toast.success("OTP verified successfully");
      },
      onError: (err) => {
        if (err instanceof AxiosError) toast.error(err.response?.data?.message);
      },
    });
  };


  const handleResetPassword = async () => {
    const result = PasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((e: typeof result.error.issues[0]) => (fieldErrors[e.path[0].toString()] = e.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    console.log({ email, token, password })
    forgetPasswordInvestorResetPassword({ email, token, password }, {
      onSuccess: (res) => {
        console.log(res);
        navigate("/investor/login")
        setStep(1);
        setEmail("");
        setOtp("");
        setPassword("");
        setConfirmPassword("");
        toast.success("Password reset successfully");
      },
      onError: (err) => {
        if (err instanceof AxiosError) toast.error(err.response?.data?.message);
      },
    });
  };

  return (
    <div className="min-h-screen md:h-screen grid grid-cols-1 md:grid-cols-2 items-stretch bg-background text-foreground md:overflow-hidden">
      <motion.div className="relative h-full">
        <LeftPanel />
      </motion.div>

      <div className="flex items-center justify-center px-6 py-10 sm:px-8 md:px-10 md:py-0 min-h-screen md:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-xl shadow-black/5">
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

            <div className="px-6 pb-4">
              {/* Step 1: Email */}
              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-md border border-border px-4 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  <button
                    onClick={handleEmailSubmit}
                    className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  >
                    Send OTP
                  </button>
                </div>
              )}

              {/* Step 2: OTP */}
              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="rounded-md border border-border px-4 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                  <button
                    onClick={handleOtpSubmit}
                    className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  {/* New Password */}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border border-border px-4 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                  {/* Confirm Password */}
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-md border border-border px-4 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}

                  <button
                    onClick={handleResetPassword}
                    className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  >
                    Reset Password
                  </button>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 text-sm text-muted-foreground text-center">
              Remember your password?{" "}
              <a href="/investor/login" className="text-primary font-medium hover:underline">
                Login
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
