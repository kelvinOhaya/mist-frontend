import LoadingDots from "@components/shared/LoadingDots";
import { Navigate } from "react-router-dom";
import useAuth from "@contexts/auth/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading, isLoggingOut } = useAuth();

  const loadingStyle = {
    position: "absolute",
    transform: "translate(-50%,-50%)",
    top: "50%",
    left: "50%",
  };

  if (isLoading) {
    return (
      <div style={loadingStyle}>
        <LoadingDots />
      </div>
    );
  }

  if (!user && !isLoggingOut) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
