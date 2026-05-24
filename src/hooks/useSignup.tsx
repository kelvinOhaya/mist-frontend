import { useState } from "react";
import useAuthLogic from "./useAuthLogic";
import { checkIfUsernameExists } from "@api/authApi";
import { useNavigate } from "react-router-dom";

function useSignup() {
  const { signUp } = useAuthLogic();

  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [generalError, setGeneralError] = useState<string>("");

  const handleSignUp = async (
    e: React.SubmitEvent<HTMLFormElement>,
    rememberMe: boolean,
  ) => {
    e.preventDefault();

    //verify inputs
    try {
      const usernameExists = await checkIfUsernameExists({
        username,
      });
      if (usernameExists) {
        setGeneralError("Email already exists");
      }
    } catch {
      //console.log("Error verifying signup form: ", error);
      setGeneralError("an error occured on our part");
    }

    const signUpStatus = await signUp({ username, password }, rememberMe);
    // console.log(`Status: ${signUpStatus}`);
    if (signUpStatus === 200) {
      navigate("/chatroom");
    } else {
      setGeneralError("Issue signing in");
    }
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
    generalError,
  };
}

export default useSignup;
