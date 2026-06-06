import { useEffect } from "react";
import "../../styles/global.css";
import useChatRoom from "@contexts/chatRoom/useChatRoom";
import useSocket from "../../contexts/socket/useSocket";
import useAuth from "../../contexts/auth/useAuth";
import ActiveTabs from "@components/tabs/Navbar";

function ChatRoom() {
  const { loadChatRooms } = useChatRoom();
  const { isLoading, user, accessToken } = useAuth();

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const fetchChatRooms = async () => {
      if (!isLoading && user && accessToken && socket != null) {
        await loadChatRooms();
      }
    };
    fetchChatRooms();
  }, [socket, isLoading, user, accessToken, loadChatRooms]);

  if (isLoading) return null;

  return (
    <div className="fixed top-0 left-0 h-dvh w-full overflow-hidden bg-(--neutral-bg)">
      <ActiveTabs />
    </div>
  );
}

export default ChatRoom;
