import LoginForm, { type LoginFormData } from "../../../components/auth/LoginForm"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useGoogleLoginMutation, useUserLogin } from "../../../hooks/Auth/AuthHooks"
import { useDispatch } from "react-redux"
import { setData } from "../../../store/Slice/authDataSlice"
import { setToken } from "../../../store/Slice/tokenSlice"
import { motion } from "framer-motion"
import { AxiosError } from "axios"
import LeftPanel from "../../../components/auth/LeftPanal"
import { Button } from "../../../components/ui/button"
import { useGoogleLogin } from "@react-oauth/google"

const UserLoginPage = () => {
  const { mutate: userLogin } = useUserLogin()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { mutate: googleLoginMutate } = useGoogleLoginMutation();

  const handleUserLogin = (values: LoginFormData) => {
    userLogin(values, {
      onSuccess: (res) => {
        console.log("response", res)
        toast.success("Login successfull")
        dispatch(
          setData({
            _id: res.data.user._id,
            userName: res.data.user.userName,
            email: res.data.user.email,
            role: res.data.user.role,
            status: res.data.user.status,
            isFirstLogin: res.data.user.isFirstLogin,
            profileImg: res.data.user.profileImg,
            bio: res.data.user.bio,
            website: res.data.user.website,
            linkedInUrl: res.data.user.linkedInUrl,
            adminVerified: res.data.user.adminVerified,
            companyName: res.data.user.companyName,
          })
        );
        dispatch(setToken(res.data?.accessToken || ""))
        navigate("/home")
      },
      onError: (err) => {
        console.log("cath", err)
        console.log("axios error  ")
        if (err instanceof AxiosError) {
          const errMsg = err.response?.data.message
          console.log("Error while login ,", errMsg)
          toast.error(errMsg)
        }
      },
    })
  }

  const login = useGoogleLogin({
    onSuccess: (res) => handleGoogleLoginSuccess(res.code),
    onError: (err) => console.log(err),
    flow: "auth-code",
  });

  const handleGoogleLoginSuccess = (code: string) => {
    const role = "USER"
    googleLoginMutate(
      { authorizationCode: code, role },
      {
        onSuccess: (res) => {
          if (res.data?.user.role !== role) {
            toast.error(`You are not a ${role}`);
            return;
          }
          toast.success(res.message);
          console.log("data from backend during login : ", res.data.user)
          dispatch(
            setData({
              _id: res.data.user._id,
              userName: res.data.user.userName,
              email: res.data.user.email,
              role: res.data.user.role,
              status: res.data.user.status,
              isFirstLogin: res.data.user.isFirstLogin,
              profileImg: res.data.user.profileImg,
              bio: res.data.user.bio,
              website: res.data.user.website,
              linkedInUrl: res.data.user.linkedInUrl,
              adminVerified: res.data.user.adminVerified,
              companyName: res.data.user.companyName,
            })
          );
          dispatch(setToken(res.data?.accessToken || ""));

        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err?.response?.data?.message)
          }
          // toast.error("Google login failed");
          // console.error("error in google");
        },
      }
    );
  };


  return (
    <div className="min-h-screen md:h-screen grid grid-cols-1 md:grid-cols-2 items-stretch bg-background text-foreground md:overflow-hidden">
      {/* Left visual panel */}
      <motion.div className="relative h-full">
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
              <h1 className="text-2xl font-semibold tracking-tight text-pretty ">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>
            </div>

            {/* Form */}
            <div className="px-6 pb-4">
              <LoginForm onSubmit={handleUserLogin} />

              <Button
                onClick={() => login()}
                type="button"
                className="w-full mt-4 x-4 py-2 border flex gap-2 bg-white hover:bg-gray-50  border-slate-200  rounded-lg text-slate-700  hover:border-slate-300  hover:text-slate-900  hover:shadow transition duration-150"
              >
                <img
                  className="w-6 h-6"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  loading="lazy"
                  alt="google logo"
                ></img>
                Login
              </Button>
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
