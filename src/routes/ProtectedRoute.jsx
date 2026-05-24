import LoadingIcon from "../components/general/LoadingIcon/LoadingIcon";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthLogic from "@hooks/useAuthLogic";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading, isLoggingOut } = useAuthLogic();
  const navigate = useNavigate();
  console.log("ProtectedRoute render:", {
    user,
    isLoading,
  });

  const loadingStyle = {
    position: "absolute",
    transform: "translate(-50%,-50%)",
    top: "50%",
    left: "50%",
  };

  useEffect(() => {
    if (!isLoading && !user && !isLoggingOut) {
      console.log("ProtectedRoute: no access token, redirecting");
      navigate("/auth", { replace: true });
    }
  }, [isLoading, user, isLoggingOut, navigate]);

  if (isLoading) {
    return (
      <div style={loadingStyle}>
        <LoadingIcon />
      </div>
    );
  }

  if (!user && !isLoggingOut) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
