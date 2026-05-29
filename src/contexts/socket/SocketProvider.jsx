import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import socketContext from "./socketContext";
import useAuth from "../auth/useAuth";

function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const userId = user?._id;

    if (!userId) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      return;
    }

    socketRef.current?.disconnect();

    const nextSocket = io(import.meta.env.VITE_BASE_BACKEND_URL, {
      auth: { userId },
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current = nextSocket;
    setSocket(nextSocket);

    return () => {
      nextSocket.disconnect();
      if (socketRef.current === nextSocket) {
        socketRef.current = null;
      }
    };
  }, [user?._id]);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
}

export default SocketProvider;
