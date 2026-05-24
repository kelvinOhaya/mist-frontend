import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TbEye, TbEyeOff } from "react-icons/tb";
import { colorMap } from "@utils/colors";

interface InputFieldProps {
  id: string;
  placeholder: string;
  type: "text" | "password";
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  errorMsg?: string[];
  validator?: (input: string) => boolean;
  setEnableFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  neutralOnValid?: boolean;
}
function InputField({
  id,
  placeholder,
  type,
  value,
  setValue,
  onChange,
  errorMsg,
  validator,
  setEnableFlag,
  neutralOnValid,
}: InputFieldProps) {
  const [fieldState, setFieldState] = useState<
    "valid" | "invalid" | "focused" | "neutral"
  >("neutral");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [controlledType, setControlledType] = useState<"password" | "text">(
    type === "password" ? "password" : "text",
  );
  const inputRef = useRef<HTMLInputElement | null>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) {
        setValue(inputRef.current.value);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!setEnableFlag) return;
    setEnableFlag(isValid);
  }, [isValid, setEnableFlag]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    validate(event);
  };

  const validate: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    const isSuccess: boolean | undefined = validator?.(e.target.value);
    //if a validator was provided
    if (isSuccess !== undefined) {
      if (isSuccess === true) {
        setFieldState("valid");
        setIsValid(true);
      } else {
        setFieldState("invalid");
        setIsValid(false);
      }
      //if a validator wasn't provided
    } else {
      if (e.target.value.length === 0) {
        setIsValid(false);
      } else {
        setFieldState("valid");
        setIsValid(true);
      }
    }
    // console.log(`${id}: ${fieldState}`);
  };

  const handleBlur = () => {
    if (neutralOnValid) {
      setFieldState((prev) =>
        prev === "valid" || prev === "focused" ? "neutral" : prev,
      );
    } else setFieldState((prev) => (prev === "focused" ? "neutral" : prev));
  };

  const statusColor: string =
    fieldState === "focused"
      ? colorMap.p100
      : fieldState === "valid"
        ? neutralOnValid
          ? colorMap.p100
          : colorMap.success
        : fieldState === "invalid"
          ? colorMap.error
          : colorMap.p100 + "33";

  return (
    <>
      <div className="relative flex justify-start flex-col">
        <motion.div
          animate={{ borderColor: statusColor }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="border-3 border-solid py-1.5 px-3 rounded-xl w-full text-(--p100) bg-transparent mb-2"
        >
          <input
            className="inputField appearance-none outline-none border-none focus:outline-none bg-transparent"
            autoComplete={type === "password" ? "current-password" : "off"}
            id={id}
            value={value}
            onInput={(e: React.FormEvent<HTMLInputElement>) =>
              setValue(e.currentTarget.value)
            }
            onChange={(event) => handleChange(event)}
            onFocus={() => setFieldState("focused")}
            onBlur={() => handleBlur()}
            type={controlledType}
            placeholder={placeholder}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() =>
                setControlledType((prev) =>
                  prev === "password" ? "text" : "password",
                )
              }
              className="absolute top-3.5 right-4 text-(--p100)"
            >
              {controlledType === "text" ? <TbEye /> : <TbEyeOff />}
            </button>
          )}
        </motion.div>
      </div>
      <motion.span
        animate={{
          opacity: fieldState === "focused" ? 1 : 0.67,
          color: statusColor,
        }}
        transition={{ duration: 0.15 }}
        className=" text-sm"
      >
        {/* allows the full width of the input button to always be as long as its error msg */}
        <div className="relative">
          <span className="text-nowrap text-left">
            {errorMsg &&
              errorMsg.map((msg: string, i: number) => (
                <span
                  key={i}
                  className="block w-max overflow-hidden whitespace-nowrap "
                >
                  {msg}
                </span>
              ))}
          </span>
        </div>
      </motion.span>
    </>
  );
}

export default InputField;
