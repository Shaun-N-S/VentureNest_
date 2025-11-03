import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useDispatch } from "react-redux";
import { clearData } from "../../store/Slice/authDataSlice";
import { deleteToken } from "../../store/Slice/tokenSlice";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import { useLogout } from "../../hooks/Auth/AuthHooks";
import toast from "react-hot-toast";

const Dashboard = () => {

  const userData = useSelector((state: Rootstate) => state.authData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: logout } = useLogout()

  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => {
        const currentRole = userData.role;
        console.log(currentRole)
        dispatch(clearData());
        dispatch(deleteToken());

        if (currentRole === "INVESTOR") {
          navigate('/investor/login');
        } else if (userData.role === "ADMIN") {
          navigate('/admin/login');
        } else {
          navigate('/login');
        }
      },
      onSuccess: () => {
        toast.success("Logged out successfully ")
      },
      onError: () => {
        toast.error("Logged out failed");
      }
    })
  };
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* <div className="grid grid-cols-2 gap-4"> */}
      {/* <div className="p-6 bg-white rounded shadow">Total Users: 50</div>
        <div className="p-6 bg-white rounded shadow">Total Investors: 20</div> */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 w- bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
      {/* </div> */}
    </AdminLayout>
  );
};

export default Dashboard;
