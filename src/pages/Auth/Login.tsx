import { motion } from "framer-motion";
import InputField from "@components/shared/InputField";
import { Checkmark } from "react-checkmark";
import { colorMap } from "@utils/colors";
import useLogin from "@hooks/useLogin";
import Loader from "@components/shared/Loader";
import ErrorShakeWrapper from "@components/shared/ErrorShakeWrapper";

interface LoginProps {
  setMode: React.Dispatch<React.SetStateAction<string>>;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
  rememberMe: boolean;
}

function Login({ setMode }: LoginProps) {
  //handles the state for logging in
  const {
    handleLogin,
    username,
    setUsername,
    usernameIsValid,
    setUsernameIsValid,
    password,
    setPassword,
    passwordIsValid,
    setPasswordIsValid,
    error,
    loadingState,
    rememberMe,
    setRememberMe,
  } = useLogin();
  const inputsAreValid: boolean = usernameIsValid && passwordIsValid;

  return (
    <div className="rounded-3xl absolute top-1/2 left-1/2 transform-[translate(-50%,-50%)] flex flex-col px-8 items-center bg-(--p100), border-radius-5 xs:w-[90vw] w-[320px] max-w-[320px] min-w-[320px]">
      <h1 className="py-5 text-(--p100) text-3xl text-center">Welcome Back</h1>
      <form
        className="flex flex-col "
        onSubmit={(e) => handleLogin(e, rememberMe)}
      >
        <InputField
          id={"username"}
          placeholder="username"
          type="text"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          setValue={setUsername}
          setEnableFlag={setUsernameIsValid}
          neutralOnValid
        />
        <InputField
          id={"password"}
          placeholder="password"
          type="password"
          value={password}
          setValue={setPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          setEnableFlag={setPasswordIsValid}
          neutralOnValid
        />

        {error == "incorrect credentials" && (
          <p className="text-(--error)">*Username Or Password Is Incorrect</p>
        )}
        {error == "server error" && (
          <p className="text-(--error)">
            *Sorry, an error on our part has occured
          </p>
        )}
        <motion.button
          type="submit"
          className="bg-(--p100) text-(--p600) rounded-xl py-2  my-3! hover:cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ opacity: inputsAreValid ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
          disabled={!inputsAreValid}
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
          <button type="button" onClick={() => setMode("signup")}>
            <span className="text-(--p100) hover:cursor-pointer text-sm">
              Sign Up
            </span>
          </button>
        </span>
      </form>

      <div style={{ opacity: loadingState === null ? 0 : 1 }}>
        <div className="flex gap-2 text-(--p100) items-center">
          {loadingState !== "error" && (
            <div className="flex items-center gap-2">
              <motion.span
                animate={{
                  color:
                    loadingState === "success"
                      ? colorMap.success
                      : colorMap.neutral,
                }}
              >
                Authenticating
              </motion.span>{" "}
              {loadingState === "loading" ? (
                <Loader size={12} color={colorMap.p100} />
              ) : loadingState === "success" ? (
                <Checkmark size={12} />
              ) : null}
            </div>
          )}

          <ErrorShakeWrapper
            show={loadingState === "error"}
            className="flex gap-2 text-(--error)"
          >
            <span>{error}</span>
          </ErrorShakeWrapper>
        </div>
      </div>
    </div>
  );
}

export default Login;
