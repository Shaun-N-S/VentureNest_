import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import type { Rootstate } from "../../store/store";

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: Rootstate) => state.token.token);
  const userRole = useSelector((state: Rootstate) => state.authData.role);

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!accessToken) {
        switch (userRole) {
          case "INVESTOR":
            navigate("/investor/login");
            break;
          case "ADMIN":
            navigate("/admin/login");
            break;
          default:
            navigate("/");
        }
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, [accessToken, navigate, userRole]);

  if (isChecking) return null;

  return accessToken ? <Outlet /> : null;
};

export default ProtectedRoute;
