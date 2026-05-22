import { motion } from "framer-motion";
import Footer from "./Footer";
import AnimatedTitle from "./AnimatedTitle";
import Background from "./Background";
import useActiveTab from "../../contexts/activeTab/useActiveTab";

interface HomeProps {
  animationsPlayed: number;
  setAnimationsPlayed: (value: number) => void;
}

function Home({ animationsPlayed, setAnimationsPlayed }: HomeProps) {
  const { navigate } = useActiveTab();

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col z-99 overflow-hidden items-center bg-linear-to-b from-(--p600) to-(--p300)">
      <Background />
      {/* Contains all texts and icons */}
      <main className="flex-1 flex flex-col text-center justify-center items-center border-radius-20">
        {/* Title and description */}
        <AnimatedTitle animationsPlayed={animationsPlayed} />
        <motion.p
          initial={animationsPlayed === 0 ? { opacity: 0, y: -5 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 1 }}
          className="text-(--p200) max-sm:text-base text-xl font-medium mb-4"
        >
          connecting people across the globe
        </motion.p>
        {/* Contains button and icons */}
        <motion.button
          initial={animationsPlayed === 0 ? { opacity: 0, y: 5 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          whileHover={{
            scale: 1.2,
            translateZ: 0,
            transition: { duration: 0.2 },
          }}
          className="text-(--p500)  py-2 px-4 bg-(--p100) rounded-full hover:cursor-pointer"
          onAnimationComplete={() => {
            if (animationsPlayed === 0) {
              setAnimationsPlayed(1);
            }
          }}
          onClick={() => navigate("Login")}
        >
          <p className="font-medium text-xl ">Get Started</p>
        </motion.button>
        {/* Feature icons */}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
