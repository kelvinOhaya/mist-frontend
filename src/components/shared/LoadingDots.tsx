import { motion } from "framer-motion";

function LoadingDots() {
  const dots = "...".split("").map((char, i) => (
    <motion.span
      key={i}
      animate={{ y: [0, -5, 0, 0, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: i * 0.5,
      }}
    >
      {char}
    </motion.span>
  ));
  return <span className="inline-flex gap-1">{dots}</span>;
}
export default LoadingDots;
