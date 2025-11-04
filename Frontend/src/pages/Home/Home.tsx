import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/bar/Navbar';
import { clearData } from '../../store/Slice/authDataSlice';
import { deleteToken } from '../../store/Slice/tokenSlice';
import type { Rootstate } from '../../store/store';
import { useLogout } from '../../hooks/Auth/AuthHooks';
import toast from 'react-hot-toast';

const Home = () => {
  const userData = useSelector((state: Rootstate) => state.authData);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { mutate: logout } = useLogout()

  console.log("userData from redux store", userData);

  // const handleLogout = () => {
  //   const currentRole = userData.role;
  //   console.log(currentRole);

  //   logout(undefined, {
  //     onSuccess: () => {
  //       dispatch(clearData());
  //       dispatch(deleteToken());
  //       toast.success("Logged out successfully!");

  //       if (currentRole === "INVESTOR") {
  //         navigate("/investor/login");
  //       } else if (currentRole === "ADMIN") {
  //         navigate("/admin/login");
  //       } else {
  //         navigate("/login");
  //       }
  //     },
  //     onError: () => {
  //       toast.error("Logout failed. Please try again.");
  //     },
  //   });
  // };


  return (
    <>
      <Navbar role={userData?.role ?? "USER"} />
      {/* <div className="flex justify-center items-center min-h-screen">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div> */}
    </>
  );
};

export default Home;
