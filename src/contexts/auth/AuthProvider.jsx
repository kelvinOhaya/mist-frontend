import { useMemo } from "react";
import AuthContext from "./AuthContext";
import useAuthLogic from "@hooks/useAuthLogic";

const AuthProvider = ({ children }) => {
  const {
    user,
    setUser,
    login,
    signUp,
    logout,
    fetchUser,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    isLoading,
    setIsLoading,
    isLoggingOut,
    setIsLoggingOut,
  } = useAuthLogic();

  const authContextValue = useMemo(
    () => ({
      user,
      setUser,
      login,
      signUp,
      logout,
      fetchUser,
      accessToken,
      setAccessToken,
      refreshToken,
      setRefreshToken,
      isLoading,
      setIsLoading,
      isLoggingOut,
      setIsLoggingOut,
    }),
    [
      user,
      setUser,
      login,
      signUp,
      logout,
      fetchUser,
      accessToken,
      setAccessToken,
      refreshToken,
      setRefreshToken,
      isLoading,
      setIsLoading,
      isLoggingOut,
      setIsLoggingOut,
    ],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
