import LoginForm, { type LoginFormData } from "../../components/auth/LoginForm"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useUserLogin } from "../../hooks/AuthHooks"
import { useDispatch } from "react-redux"
import { setData } from "../../store/Slice/authDataSlice"
import { setToken } from "../../store/Slice/tokenSlice"
import { motion } from "framer-motion"
import { AxiosError } from "axios"
import LeftPanel from "../../components/auth/LeftPanal"

const UserLoginPage = () => {
  const { mutate: login } = useUserLogin()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleUserLogin = (values: LoginFormData) => {
    login(values, {
      onSuccess: (res) => {
        toast.success("Login successfull")
        dispatch(setData(res.data.user))
        dispatch(setToken(res.data.accessToken))
        navigate("/home")
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          const errMsg = err.response?.data?.message
          console.log("Error while login ,", err)
          toast.error(errMsg)
        }
      },
    })
  }

  return (
    <div className="min-h-screen md:h-screen grid grid-cols-1 md:grid-cols-2 items-stretch bg-background text-foreground md:overflow-hidden">
      {/* Left visual panel */}
      <motion.div
        // initial={{ opacity: 0, x: -16 }}
        // animate={{ opacity: 1, x: 0 }}
        // transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full"
      >
        {/* Replace previous image-based panel with reusable component */}
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
              <div className="mb-3 flex items-center gap-3">
                <img src="/placeholder-logo.svg" alt="VentureNest logo" className="h-6 w-6" />
                <span className="text-sm font-medium text-muted-foreground">VentureNest</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-pretty ">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>
            </div>

            {/* Form */}
            <div className="px-6 pb-4">
              <LoginForm onSubmit={handleUserLogin} />
            </div>

            {/* Footer actions */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between text-sm">
                <a
                  href="/forgot-password"
                  className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
                <div className="text-muted-foreground">
                  {"Don't have an account? "}
                  <Link to="/signup" className="text-primary font-medium hover:underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            Protected by industry-standard security. Need help? Contact support.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default UserLoginPage
