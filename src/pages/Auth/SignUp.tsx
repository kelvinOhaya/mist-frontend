import { motion } from "framer-motion";
import InputField from "@components/shared/InputField";
import { Checkmark } from "react-checkmark";
import { colorMap } from "@utils/colors";
import { matchedPasswordValidator, testPassword } from "@utils/validators";
import Loader from "@components/shared/Loader";
import useSignup from "@hooks/useSignup";
import ErrorShakeWrapper from "@components/shared/ErrorShakeWrapper";

interface SignUpProps {
  setMode: React.Dispatch<React.SetStateAction<string>>;
  rememberMe: boolean;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
}

function SignUp({ setMode, rememberMe, setRememberMe }: SignUpProps) {
  const {
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
  } = useSignup();

  const inputsAreValid: boolean =
    usernameIsValid && passwordIsValid && confirmedPasswordIsValid;

  return (
    <div className="rounded-3xl absolute top-1/2 left-1/2 transform-[translate(-50%,-50%)] flex flex-col px-8 items-center bg-(--p100), border-radius-5 xs:w-[90vw] w-[320px] max-w-[320px] min-w-[320px]">
      <h1 className="py-5 text-(--p100) text-3xl text-center ">
        It's good to have you
      </h1>
      <form
        className="flex flex-col"
        onSubmit={(e) => handleSignUp(e, rememberMe)}
      >
        <InputField
          id="username"
          placeholder="username"
          type="text"
          value={username}
          setValue={setUsername}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          setEnableFlag={setUsernameIsValid}
        />

        <InputField
          id="password"
          placeholder="password"
          type="password"
          value={password}
          setValue={setPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          validator={testPassword}
          setEnableFlag={setPasswordIsValid}
          errorMsg={[
            "* at least 8 characters",
            "* at least 1 uppercase letter",
            "* at least 1 symbol",
          ]}
        />

        <InputField
          id="confirmedPassword"
          placeholder="confirm password"
          type="password"
          value={confirmedPassword}
          setValue={setConfirmedPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmedPassword(e.target.value)
          }
          validator={(input: string) =>
            matchedPasswordValidator(password, input)
          }
          setEnableFlag={setConfirmedPasswordIsValid}
          errorMsg={["* passwords must match"]}
        />

        <motion.button
          type="submit"
          className="bg-(--p100) text-(--p600) rounded-xl py-2 my-3! hover:cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ opacity: inputsAreValid ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
          disabled={!inputsAreValid}
        >
          SIGN UP
        </motion.button>

        <span className="self-end flex gap-2">
          <motion.button
            type="button"
            className="text-(--p200) text-sm flex gap-2 items-center hover:cursor-pointer"
            onClick={() => setRememberMe((prev) => !prev)}
            animate={{
              color: rememberMe ? colorMap.success : colorMap.p100,
              transition: { duration: 0.2 },
            }}
          >
            remember me
            {rememberMe ? (
              <Checkmark size="1rem" color={colorMap.success} />
            ) : (
              <span className="inline-block w-4 h-4 rounded-sm border-2 border-(--p100)" />
            )}
          </motion.button>
        </span>

        <span className="self-end">
          <span className="text-(--p200) text-sm">
            Already have an account?
          </span>{" "}
          <button type="button" onClick={() => setMode("login")}>
            <span className="text-(--p100) hover:cursor-pointer text-sm">
              Log in here
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
                Creating account
              </motion.span>
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
            <span>{generalError}</span>
          </ErrorShakeWrapper>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
