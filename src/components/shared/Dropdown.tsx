import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";
import { FaGear } from "react-icons/fa6";

interface DropdownProps {
  title: string;
  options: Option[];
}

interface Option {
  icon?: ReactNode;
  text: string;
  onClick: () => void;
  bg?: string;
}

function Dropdown({ options, title }: DropdownProps) {
  const [dropdownIsOpen, setDropdownIsOpen] = useState<boolean>(false);
  return (
    <div className="absolute top-2 right-4 w-fit h-fit flex flex-col items-end z-1">
      <motion.button
        whileHover={{ rotate: 135 }}
        transition={{ type: "spring", duration: 0.5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setDropdownIsOpen((prev) => !prev)}
        className="absolute top-2 right-2 z-1"
      >
        <FaGear color={"white"} size={24} />
      </motion.button>
      <AnimatePresence>
        {dropdownIsOpen && (
          <motion.div
            initial={{
              opacity: [1, 1, 1, 0],
              scaleX: [1, 1, 0.185],
              scaleY: [1, 0.2, 0.2],
            }}
            animate={{
              opacity: 1,
              scaleX: [0.185, 1, 1],
              scaleY: [0.2, 0.2, 1],
            }}
            exit={{
              opacity: [1, 1, 1, 0],
              scaleX: [1, 1, 0.185],
              scaleY: [1, 0.2, 0.2],
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute origin-top-right flex flex-col items-start bg-neutral-900 p-2 rounded-3xl drop-shadow-2xl pt-2"
          >
            <motion.div
              initial={{ opacity: 0, z: 0 }}
              animate={{ opacity: [0, 0, 0, 1], z: 0 }}
              exit={{ opacity: [1, 0, 0, 0], z: 0 }}
              className="flex flex-col items-start gap-1"
            >
              <span className="self-center my-1 mb-2 text-xl">{title}</span>

              {options.map((opt, i) => (
                <OptionComponent
                  key={i}
                  icon={opt.icon || null}
                  text={opt.text}
                  onClick={() => {
                    opt.onClick();
                    setDropdownIsOpen(false);
                  }}
                  bg={opt.bg || undefined}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface OptionComponentProps {
  icon?: ReactNode | null;
  text: string;
  onClick: () => void;
  bg?: string;
}

function OptionComponent({
  icon = null,
  text,
  onClick,
  bg = "none",
}: OptionComponentProps) {
  return (
    <button
      type="button"
      className={`flex items-start gap-2 w-full text-baseline hover:bg-(--neutral-border) hover:cursor-pointer transition-colors duration-300 px-2 py-1 rounded-3xl bg-${bg} ${!icon && "justify-between"} whitespace-nowrap`}
      onClick={() => {
        onClick();
      }}
    >
      {icon && icon}
      {!icon && <span className="opacity-0"></span>}
      <span className="self-center">{text}</span>
      {!icon && <span className="opacity-0"></span>}
    </button>
  );
}

export default Dropdown;
