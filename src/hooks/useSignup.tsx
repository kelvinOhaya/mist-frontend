import { useEffect, useState } from "react";
import useAuthLogic from "./useAuthLogic";
import { checkIfUsernameExists } from "@api/authApi";
import { useNavigate } from "react-router-dom";
import { matchedPasswordValidator } from "@utils/validators";

function useSignup() {
  const { signUp } = useAuthLogic();

  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [usernameIsValid, setUsernameIsValid] = useState<boolean>(false);
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [confirmedPasswordIsValid, setConfirmedPasswordIsValid] =
    useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string>("");
  const [loadingState, setLoadingState] = useState<
    "loading" | "success" | "error" | null
  >(null);

  useEffect(() => {
    setConfirmedPasswordIsValid(
      matchedPasswordValidator(password, confirmedPassword),
    );
  }, [password, confirmedPassword]);

  const handleSignUp = async (
    e: React.FormEvent<HTMLFormElement>,
    rememberMe: boolean,
  ) => {
    e.preventDefault();
    setLoadingState("loading");
    setGeneralError("");

    try {
      const usernameExists = await checkIfUsernameExists({
        username,
      });
      if (usernameExists) {
        setGeneralError("username already exists");
        setLoadingState("error");
        return;
      }
    } catch {
      setGeneralError("an error occured on our part");
      setLoadingState("error");
      return;
    }

    const signUpStatus = await signUp({ username, password }, rememberMe);
    if (signUpStatus === 200) {
      setLoadingState("success");
      navigate("/dashboard");
      return;
    }

    if (signUpStatus == 401) {
      setGeneralError("invalid username or password");
    } else {
      setGeneralError("an error occured on our part");
    }
    setLoadingState("error");
    return;
  };

  return {
    handleSignUp,
    username,
    setUsername,
    password,
    setPassword,
    confirmedPassword,
    setConfirmedPassword,
    usernameIsValid,
    setUsernameIsValid,
    passwordIsValid,
    setPasswordIsValid,
    confirmedPasswordIsValid,
    setConfirmedPasswordIsValid,
    loadingState,
    generalError,
  };
}

export default useSignup;
