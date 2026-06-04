import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface ErrorShakeWrapperProps {
  show: boolean;
  children: ReactNode;
  className?: string;
}

function ErrorShakeWrapper({
  show,
  children,
  className = "",
}: ErrorShakeWrapperProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: -10 }}
          animate={{ x: [0, -10, 10, -8, 8, -4, 4, 0] }}
          exit={{ x: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeInOut",
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ErrorShakeWrapper;
