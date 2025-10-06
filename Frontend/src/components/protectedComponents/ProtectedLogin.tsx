import React, { useEffect, useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { Rootstate } from "../../store/store";

interface ProtectedLoginProps {
  children: ReactNode;
}

const ProtectedLogin: React.FC<ProtectedLoginProps> = ({ children }) => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: Rootstate) => state.token.token);
  const userRole = useSelector((state: Rootstate) => state.authData.role);

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (accessToken) {
        switch (userRole) {
          case "INVESTOR":
            navigate("/investor/home");
            break;
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/home");
        }
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, [accessToken, navigate, userRole]);

  if (isChecking) return null;

  return !accessToken ? <>{children}</> : null;
};

export default ProtectedLogin;
