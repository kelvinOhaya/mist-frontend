import { motion } from "framer-motion";
interface OverlayProps {
  trigger: () => void;
}
function Overlay({ trigger }: OverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-screen h-screen bg-black/50"
      onClick={(e) => {
        e.stopPropagation();
        trigger();
      }}
    ></motion.div>
  );
}

export default Overlay;
