import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { Rootstate } from "../../store/store";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: Rootstate) => state.token.token);
  const userRole = useSelector((state: Rootstate) => state.authData.role);

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for redux to hydrate
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
            navigate("/login");
        }
      }
      setIsChecking(false);
    }, 100); // small delay to let redux update

    return () => clearTimeout(timeout);
  }, [accessToken, navigate, userRole]);

  // While checking, render nothing to avoid flicker
  if (isChecking) return null;

  return accessToken ? <>{children}</> : null;
};

export default ProtectedRoute;
