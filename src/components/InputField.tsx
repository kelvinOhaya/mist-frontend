import { useState } from "react";
import { motion } from "framer-motion";
import { TbEye, TbEyeOff } from "react-icons/tb";
import { colorMap } from "../utils/colors";

interface InputFieldProps {
  id: string;
  placeholder: string;
  type: "text" | "password";
  value: string;
  onChange: (
    value: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => void;
  errorMsg: string;
  validator: () => boolean;
}
function InputField({
  id,
  placeholder,
  type,
  value,
  onChange,
  errorMsg,
  validator,
}: InputFieldProps) {
  const [fieldState, setFieldState] = useState<
    "valid" | "invalid" | "focused" | "neutral"
  >("neutral");
  const [controlledType, setControlledType] = useState<"password" | "text">(
    type === "password" ? "password" : "text",
  );

  const validate: () => void = () => {
    const isSuccess = validator();
    if (isSuccess) {
      setFieldState("neutral");
    } else {
      setFieldState("invalid");
    }
  };

  const borderColor: string =
    fieldState === "focused"
      ? colorMap.p100
      : fieldState === "valid"
        ? colorMap.success
        : fieldState === "invalid"
          ? colorMap.error
          : colorMap.p100 + "33";

  return (
    <div className="relative flex justify-start flex-col">
      {type === "password" && (
        <button
          type="button"
          onClick={() =>
            setControlledType((prev) =>
              prev === "password" ? "text" : "password",
            )
          }
          className="absolute top-1/2 right-4 transform-[translateY(-100%)] text-(--p100)"
        >
          {controlledType === "text" ? <TbEye /> : <TbEyeOff />}
        </button>
      )}
      <motion.div
        animate={{ borderColor: borderColor }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="border-3 border-solid py-1.5 px-3 rounded-xl w-full text-(--p100) bg-transparent"
      >
        <input
          className="inputField appearance-none outline-none border-none focus:outline-none bg-transparent"
          autoComplete={type === "password" ? "current-password" : "off"}
          id={id}
          value={value}
          onChange={(event) => onChange(event)}
          onFocus={() => setFieldState("focused")}
          onBlur={() => validate()}
          type={controlledType}
          placeholder={placeholder}
        />
      </motion.div>
      <motion.p
        animate={{
          opacity: fieldState === "invalid" ? 1 : 0,
          y: fieldState === "invalid" ? 0 : -5,
        }}
        transition={{ duration: 0.15 }}
        className="text-(--error) text-sm"
      >
        {errorMsg}
      </motion.p>
    </div>
  );
}

export default InputField;
