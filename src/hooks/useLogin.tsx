import { useRef, useState } from "react";
import useAuthLogic from "./useAuthLogic";
import { useNavigate } from "react-router-dom";

function useLogin() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [usernameIsValid, setUsernameIsValid] = useState<boolean>(false);
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const { login } = useAuthLogic();
  const navigate = useNavigate();
  const submittingRef = useRef(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
    rememberMe: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setLoadingState("loading");
    // Prevent multiple submissions
    if (submittingRef.current) return;
    submittingRef.current = true;

    try {
      console.log("Calling login...");
      const loginStatus = await login({ username, password }, rememberMe);
      console.log("Login response:", loginStatus);
      if (loginStatus === 200) {
        console.log("Login successful, navigating...");
        setLoadingState("success");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate("/chatroom");
      } else {
        console.log("Login failed:", loginStatus);
      }
      if (loginStatus == 401) {
        setError("invalid username or password");
        setLoadingState("error");
      } else {
        setError("an error occured on our part");
        setLoadingState("error");
      }
    } catch (error) {
      console.log("Login error:", error);
      setError("an error occured on our part");
      setLoadingState("error");
    } finally {
      submittingRef.current = false;
    }
  };
  return {
    handleLogin,
    username,
    setUsername,
    usernameIsValid,
    setUsernameIsValid,
    password,
    setPassword,
    passwordIsValid,
    setPasswordIsValid,
    loadingState,
    error,
  };
}

export default useLogin;
