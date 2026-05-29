import useChatRoom from "@contexts/chatRoom/useChatRoom";
import { useState } from "react";
import { TbSend2 } from "react-icons/tb";
import { motion } from "framer-motion";

function TextBar() {
  const { sendMessage, currentChat } = useChatRoom();

  const [textValue, setTextValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  return (
    <div className=" absolute  bottom-4 w-full flex items-center p-4">
      <form
        className="grow  flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (textValue === "") return;
          sendMessage(currentChat._id, textValue);
          setTextValue("");
          setIsDisabled(true);
        }}
      >
        <motion.input
          type="text"
          className={`bg-white/5 grow border-2 rounded-full px-6 backdrop-blur-lg bg-2xl py-3 text-(--neutral-primary-text) outline-none opacity-80 transition-colors duration-200 ease-in-out ${isFocused ? "border-(--p300)" : "border-(--neutral-border)"}`}
          value={textValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            const nextValue = e.target.value;
            setTextValue(nextValue);
            setIsDisabled(nextValue === "");
          }}
        />
        <motion.button
          type="submit"
          disabled={isDisabled}
          className={`rounded-full transition-colors duration-200 ease-in-out ${isFocused ? "text-(--p300)" : "text-(--neutral-border)"}`}
        >
          <TbSend2 size={24} />
        </motion.button>
      </form>
    </div>
  );
}

export default TextBar;
