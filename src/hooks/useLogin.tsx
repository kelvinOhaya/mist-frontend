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
      const loginResult = await login({ username, password }, rememberMe);

      if (loginResult.status === 200) {
        setLoadingState("success");
        navigate("/dashboard");
        return;
      }

      if (loginResult.status == 401) {
        setError("invalid username or password");
        setLoadingState("error");
      } else {
        console.log(loginResult);
        setError("an error occured on our part");
        setLoadingState("error");
      }
    } catch (error) {
      console.log(error);
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
