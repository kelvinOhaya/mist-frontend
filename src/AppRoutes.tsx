import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import ChatRoom from "./pages/Dashboard/ChatRoom";
import ProtectedRoute from "@routes/ProtectedRoute";
import ChatRoomProvider from "@contexts/chatRoom/ChatRoomProvider";
import SocketProvider from "@contexts/socket/SocketProvider";
import AuthProvider from "@contexts/auth/AuthProvider";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { slideTiming } from "@utils/animationTiming";

function AppRoutes() {
  const location = useLocation();
  const [isInitialRouteRender, setIsInitialRouteRender] = useState(true);
  const [animationsPlayed, setAnimationsPlayed] = useState<number>(0);

  useEffect(() => {
    setIsInitialRouteRender(false);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none">
      <AnimatePresence mode="sync">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                className="absolute inset-0"
                initial={{ x: isInitialRouteRender ? 0 : "-100vw" }}
                animate={{ x: 0 }}
                exit={{ x: "-100vw" }}
                transition={{ duration: 0.3, ease: slideTiming as any }}
              >
                <Home
                  animationsPlayed={animationsPlayed}
                  setAnimationsPlayed={setAnimationsPlayed}
                />
              </motion.div>
            }
          />
          <Route
            path="/auth"
            element={
              <motion.div
                className="absolute inset-0"
                initial={{ x: isInitialRouteRender ? 0 : "100vw" }}
                animate={{ x: 0 }}
                exit={{ x: "-100vw" }}
                transition={{ duration: 0.3, ease: slideTiming as any }}
              >
                <AuthWrapper>
                  <Auth />
                </AuthWrapper>
              </motion.div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <motion.div
                className="absolute inset-0"
                initial={{ x: isInitialRouteRender ? 0 : "100vw" }}
                animate={{ x: 0 }}
                exit={{ x: "100vw" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <ChatRoomWrapper>
                  <ChatRoom />
                </ChatRoomWrapper>
              </motion.div>
            }
          />
          <Route
            path="/chatroom"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

interface ChildProp {
  children: ReactNode;
}

function AuthWrapper({ children }: ChildProp) {
  return <AuthProvider>{children}</AuthProvider>;
}

function ChatRoomWrapper({ children }: ChildProp) {
  return (
    <AuthProvider>
      <SocketProvider>
        <ChatRoomProvider>
          <ProtectedRoute>{children}</ProtectedRoute>
        </ChatRoomProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default AppRoutes;
