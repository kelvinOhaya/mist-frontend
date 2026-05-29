import { useRef, useState } from "react";
import useAuthLogic from "./useAuthLogic";
import { useNavigate } from "react-router-dom";

function useLogin() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [usernameIsValid, setUsernameIsValid] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
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
      const loginStatus = await login({ username, password }, rememberMe);

      if (loginStatus === 200) {
        setLoadingState("success");
        navigate("/dashboard");
        return;
      }

      if (loginStatus == 401) {
        setError("invalid username or password");
        setLoadingState("error");
      } else {
        setError("an error occured on our part");
        setLoadingState("error");
      }
    } catch (error) {
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
    rememberMe,
    setRememberMe,
    error,
  };
}

export default useLogin;
