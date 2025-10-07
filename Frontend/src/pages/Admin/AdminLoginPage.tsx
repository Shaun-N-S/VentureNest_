import toast from "react-hot-toast";
import LoginForm from "../../components/auth/LoginForm";
import { useAdminLogin } from "../../hooks/Auth/Admin/AdminAuthHooks";
import type { LoginPayload } from "../../types/AuthPayloads";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setData } from "../../store/Slice/authDataSlice";
import { setToken } from "../../store/Slice/tokenSlice";
import { AxiosError } from "axios";

const AdminLoginPage = () => {
  const { mutate: login } = useAdminLogin();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdminLogin = (values: LoginPayload) => {
    login(values, {
      onSuccess: (res) => {
        toast.success("Login Successful");
        dispatch(setData(res.data.user));
        dispatch(setToken(res.data.accessToken));
        navigate("/admin/dashboard");
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message);
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to access the admin dashboard</p>
        </div>

        {/* Form */}
        <LoginForm onSubmit={handleAdminLogin} />

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} VentureNest. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
