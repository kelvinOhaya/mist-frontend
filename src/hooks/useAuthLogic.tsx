import { useEffect, useRef, useState } from "react";
import {
  fetchUser as fetchUserRequest,
  login as loginRequest,
  logout as logoutRequest,
  refreshToken as refreshTokenRequest,
  signUp as signUpRequest,
} from "@api/authApi";
import { registerAuthInterceptors } from "@api/api";
import { Credentials, User } from "../types";

function useAuthLogic() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const accessTokenRef = useRef<string | null>(null);
  const refreshTokenRef = useRef<string | null>(null);
  // Helper function to set both tokens
  const setTokens = (
    newAccessToken: string | null,
    newRefreshToken: string | null,
  ) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
  };

  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    refreshTokenRef.current = refreshToken;
  }, [refreshToken]);

  useEffect(() => {
    const cleanupInterceptors = registerAuthInterceptors(
      () => accessTokenRef.current,
      setTokens,
      () => refreshTokenRef.current || sessionStorage.getItem("refreshToken"),
    );

    const refresh = async () => {
      try {
        // Try to get refresh token from sessionStorage on app start
        const storedRefreshToken =
          localStorage.getItem("refreshToken") ||
          sessionStorage.getItem("refreshToken");
        if (!storedRefreshToken) {
          throw new Error("No refresh token found");
        }

        const data = await refreshTokenRequest(storedRefreshToken);
        setTokens(data.accessToken, data.refreshToken);

        // Update sessionStorage with new refresh token
        sessionStorage.setItem("refreshToken", data.refreshToken);

        const userData = await fetchUserRequest(data.accessToken);
        setUser(userData);
      } catch {
        setTokens(null, null);
        sessionStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    refresh();

    return cleanupInterceptors;
  }, []);

  //creates a user in mongodb and gets both access and refresh tokens
  const signUp = async (credentials: Credentials, rememberMe: boolean) => {
    try {
      const response = await signUpRequest(credentials);
      setTokens(response.accessToken, response.refreshToken);

      // Store refresh token in sessionStorage, or local storage if the user wants to be remembered
      rememberMe === true
        ? localStorage.setItem("refreshToken", response.refreshToken)
        : sessionStorage.setItem("refreshToken", response.refreshToken);

      const userData = await fetchUserRequest(response.accessToken);
      setUser(userData);
      return 200;
    } catch (error: any) {
      //console.log("Error when trying to signup: ", error);
      return error.response.status;
    }
  };

  //send a post request to the login route and get both tokens
  const login = async (
    credentials: { username: string; password: string },
    rememberMe: boolean,
  ) => {
    try {
      const response = await loginRequest(credentials);
      setTokens(response.accessToken, response.refreshToken);

      // Store refresh token in sessionStorage, or local storage if the user wants to be remembered
      rememberMe === true
        ? localStorage.setItem("refreshToken", response.refreshToken)
        : sessionStorage.setItem("refreshToken", response.refreshToken);

      const userData = await fetchUserRequest(response.accessToken);
      setUser(userData);
      return 200;
    } catch (error: any) {
      return error.response?.status;
    }
  };

  //send a post request to the logout route and clear all tokens
  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutRequest();
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("refreshToken");
      setUser(null);
      setTokens(null, null);
    } catch {
      //ignore error, continue with logout
    } finally {
      setIsLoggingOut(false);
    }
  };

  //get the user data from the /me route (doesn't include the password)
  const fetchUser = async (token: string) => {
    if (!token) return;

    try {
      const userData = await fetchUserRequest(token);
      setUser(userData);
      return userData;
    } catch {
      setUser(null);
      return null;
    }
  };

  return {
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
  };
}

export default useAuthLogic;
