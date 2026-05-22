import styles from "./LoginSignUp.module.css";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import useAuth from "../../contexts/auth/useAuth";
import InputField from "@components/InputField";
import { Checkmark } from "react-checkmark";
import { colorMap } from "../../utils/colors";
import useActiveTab from "../../contexts/activeTab/useActiveTab";

interface LoginProps {
  setMode: React.Dispatch<React.SetStateAction<string>>;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
  rememberMe: boolean;
}

function Login({ setMode, rememberMe, setRememberMe }: LoginProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // possible states: "incorrect credentials"
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { navigate } = useActiveTab();
  const submittingRef = useRef(false);

  //handles the state for logging in
  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    // Prevent multiple submissions
    if (submittingRef.current) return;
    submittingRef.current = true;

    try {
      console.log("Calling login...");
      const loginStatus = await login({ username, password }, rememberMe);
      console.log("Login response:", loginStatus);
      if (loginStatus === 200) {
        console.log("Login successful, navigating...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("Chatroom");
      } else {
        console.log("Login failed:", loginStatus);
        loginStatus == 500
          ? setError("server error")
          : setError("incorrect credentials");
      }
    } catch (error) {
      console.log("Login error:", error);
      setError("network error");
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <div className="rounded-3xl absolute top-1/2 left-1/2 transform-[translate(-50%,-50%)] flex flex-col w-full px-8 items-center bg-(--p100), border-radius-5 ">
      <h1 className="py-5 text-(--p100) text-3xl text-center">Welcome Back</h1>
      <form className="flex flex-col " onSubmit={(e) => handleLogin(e)}>
        <InputField
          id={"username"}
          placeholder="username"
          type="text"
          errorMsg="Incorrect username"
          value={username}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
          ) => setUsername(e.target.value)}
          validator={() => 1 + 1 === 2}
        />
        <InputField
          id={"password"}
          placeholder="username"
          type="password"
          value={password}
          errorMsg="Invalid password"
          validator={() => 1 + 1 !== 2}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error == "incorrect credentials" && (
          <p className={styles.error}>*Username Or Password Is Incorrect</p>
        )}
        {error == "server error" && (
          <p className={styles.error}>
            *Sorry, an error on our part has occured
          </p>
        )}
        <motion.button
          type="submit"
          className="bg-(--p100) text-(--p600) rounded-xl py-2 my-3 hover:cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          LOGIN
        </motion.button>
        <span className="self-end flex gap-2">
          <motion.button
            type="button"
            className="text-(--p200) text-sm flex gap-2 items-center hover:cursor-pointer"
            onClick={() => setRememberMe((prev: boolean) => !prev)}
            animate={{
              color: rememberMe ? colorMap.success : colorMap.p100,
              transition: { duration: 0.2 },
            }}
          >
            remember me
            {rememberMe ? (
              <Checkmark size="1rem" color={colorMap.success} />
            ) : (
              <span className="inline-block  w-4 h-4 rounded-sm border-2 border-(--p100)"></span>
            )}
          </motion.button>
        </span>
        <span className="self-end">
          <span className="text-(--p200) text-sm">Not logged in?</span>{" "}
          <button onClick={() => setMode("signup")}>
            <span className="text-(--p100) hover:cursor-pointer text-sm">
              Sign Up
            </span>
          </button>
        </span>
      </form>
    </div>
  );
}

export default Login;
