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
  const userData = useSelector((state: Rootstate) => state.authData);

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (accessToken) {
        switch (userData.role) {
          case "INVESTOR":
            handleInvestor()
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

    const handleInvestor = () => {
      if (userData.isFirstLogin) {
        navigate('/investor/profile-completion');
      } else {
        navigate("/investor/home")
      }
    }

    return () => clearTimeout(timeout);
  }, [accessToken, navigate, userData.role]);

  if (isChecking) return null;

  return !accessToken ? <>{children}</> : null;
};

export default ProtectedLogin;
