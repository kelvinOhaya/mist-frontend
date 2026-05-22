import { motion } from "framer-motion";

interface AnimatedTitleProps {
  animationsPlayed: number;
}

function AnimatedTitle({ animationsPlayed }: AnimatedTitleProps) {
  const text: string = "Mist";
  return (
    <div className=" text-(--p100) text-5xl max-sm:text-4xl">
      {text.split("").map((letter: string, index: number) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={animationsPlayed === 0 ? { scaleY: 0 } : false}
          animate={{ scaleY: 1 }}
          transition={{ type: "spring", delay: 0.1 * index }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}

export default AnimatedTitle;
