import { ReactNode } from "react";
import Overlay from "../Overlay";
import { motion } from "framer-motion";

interface ModalProps {
  trigger: () => void;
  buttons: ModalButtonProps[];
  title: string;
  description: string;
}

export function Modal({ trigger, title, buttons, description }: ModalProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-10">
      <Overlay trigger={trigger} />
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col items-center z-1 rounded-3xl bg-(--neutral-border) p-4 drop-shadow-2xl"
      >
        <ModalTitle>{title}</ModalTitle>
        <ModalDescription>{description}</ModalDescription>
        <div className="flex gap-2 w-full">
          {buttons.map((button, i) => (
            <ModalButton
              key={i}
              highlight={button.highlight}
              onClick={button.onClick}
              text={button.text}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

interface ModalTitleProps {
  children: ReactNode;
}

export function ModalTitle({ children }: ModalTitleProps) {
  return <span className="text-2xl">{children}</span>;
}

interface ModalDescriptionProps {
  children: ReactNode;
}

export function ModalDescription({ children }: ModalDescriptionProps) {
  return <span className="my-4">{children}</span>;
}

interface ModalContainerProps {
  children: ReactNode;
  trigger: () => void;
}

export function ModalContainer({ children, trigger }: ModalContainerProps) {
  return (
    <div className="fixed top-0 left-0 w-full  h-full flex justify-center items-center z-10">
      <Overlay trigger={trigger} />
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col items-center z-1 gap-4 max-w-[80%] rounded-3xl bg-(--neutral-border) p-4 drop-shadow-2xl"
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ModalButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => any;
  highlight: boolean;
  children?: ReactNode;
  text?: string;
  disableOn?: boolean;
}

export function ModalButton({
  children,
  highlight,
  onClick,
  text,
  disableOn,
}: ModalButtonProps) {
  return (
    <button
      disabled={disableOn}
      type="button"
      className={`flex-1 w-full p-2 rounded-full ${highlight ? "bg-(--p300)" : "bg-transparent"} hover:cursor-pointer ${highlight ? "" : "border border-(--neutral-accent)"}`}
      onClick={onClick}
    >
      {children || text}
    </button>
  );
}
