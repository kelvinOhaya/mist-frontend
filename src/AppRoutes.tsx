import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import ChatRoom from "./pages/ChatRoom/ChatRoom";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChatRoomProvider from "@contexts/chatRoom/ChatRoomProvider";
import SocketProvider from "@contexts/socket/SocketProvider";
import AuthProvider from "@contexts/auth/AuthProvider";
import useActiveTab from "@contexts/activeTab/useActiveTab";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function AppRoutes() {
  const activeTab = useActiveTab()?.activeTab ?? "Home";
  const [animationsPlayed, setAnimationsPlayed] = useState<number>(0);
  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none">
      <AnimatePresence mode="sync">
        {activeTab === "Home" ? (
          <motion.div
            key="home"
            className="absolute inset-0"
            initial={{
              x: animationsPlayed === 0 && activeTab === "Home" ? 0 : "-100vw",
            }}
            animate={{ x: 0 }}
            exit={{ x: "-100vw" }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          >
            <Home
              animationsPlayed={animationsPlayed}
              setAnimationsPlayed={setAnimationsPlayed}
            />
          </motion.div>
        ) : activeTab === "Login" ? (
          <motion.div
            key="login"
            className="absolute inset-0"
            initial={{ x: animationsPlayed === 0 ? 0 : "100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "100vw" }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          >
            <AuthWrapper>
              <Auth />
            </AuthWrapper>
          </motion.div>
        ) : (
          <motion.div
            key="chatroom"
            className="absolute inset-0"
            initial={{ x: animationsPlayed === 0 ? 0 : "100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "100vw" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <ChatRoomWrapper>
              <ChatRoom />
            </ChatRoomWrapper>
          </motion.div>
        )}
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
