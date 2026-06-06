import Login from "./Login";
import SignUp from "./SignUp.tsx";
import "../../styles/global.css";
import { AnimatePresence, motion } from "framer-motion";
import { slideTiming } from "@utils/animationTiming";
import { TbArrowLeft } from "react-icons/tb";
import { useEffect, useState } from "react";
import useAuth from "../../contexts/auth/useAuth";
import { useNavigate } from "react-router-dom";

function Auth() {
  const { refreshToken, user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (!refreshToken && user) return;
    if (refreshToken && user) {
    }
  }, [refreshToken, user]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col bg-(--neutral-bg)">
      <motion.button
        layout
        initial={{ opacity: 0.7, scale: 1, z: 0 }}
        whileHover={{ scale: 1.04, opacity: 1, z: 0 }}
        className={`fixed top-8 left-8 text-(--p100) sm:text-xl text-xl flex gap-2 items-center z-99`}
        onClick={() => {
          console.log("clicked");
          navigate("/");
        }}
      >
        <TbArrowLeft /> Back to home
      </motion.button>

      <AnimatePresence mode="sync" initial={false}>
        {mode === "login" ? (
          <motion.div
            key="login"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "-100vw" }}
            transition={{ duration: 0.3, ease: slideTiming as any }}
          >
            <Login
              setMode={setMode}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
            />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "100vw" }}
            transition={{ duration: 0.3, ease: slideTiming as any }}
          >
            <SignUp
              setMode={setMode}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Auth;
