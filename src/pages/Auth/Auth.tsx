import Login from "./Login";
import SignUp from "./SignUp";
import "../../styles/global.css";
import { motion } from "framer-motion";
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
    <div className="fixed top-0 left-0 w-full h-full flex flex-col bg-linear-to-b from-(--p600) to-(--p300)">
      <motion.button
        layout
        initial={{ opacity: 0.7, scale: 1, z: 0 }}
        whileHover={{ scale: 1.04, opacity: 1, z: 0 }}
        className={`fixed top-8 left-8 text-(--p100) sm:text-xl text-xl flex gap-2 items-center`}
        onClick={() => {
          navigate("/");
        }}
      >
        <TbArrowLeft /> Back to home
      </motion.button>

      {mode === "login" ? (
        <Login
          setMode={setMode}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
        />
      ) : (
        <SignUp
          setMode={setMode}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
        />
      )}
    </div>
  );
}

export default Auth;
