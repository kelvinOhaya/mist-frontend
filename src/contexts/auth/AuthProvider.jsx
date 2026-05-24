/* Auth Provider provides the context that authContext will hold
  Includes:
    - functions for logging in, signing up, logging out, and getting user data
    - state variables for access tokens, the user data, and whether the screen is loading or not
*/
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
  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
