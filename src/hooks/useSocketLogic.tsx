import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "@contexts/auth/useAuth";

function useSocketLogic() {
  const auth = useAuth();
  const [socket, setSocket] = useState<any>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const userId = auth?.user?._id;
    const backendUrl = import.meta.env.VITE_BASE_BACKEND_URL;

    const disconnectSocket = () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
    };

    if (!userId || !backendUrl) {
      disconnectSocket();
      return;
    }

    disconnectSocket();

    const nextSocket = io(backendUrl, {
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
        setSocket(null);
      }
    };
  }, [auth?.user?._id]);

  return { socket };
}

export default useSocketLogic;
