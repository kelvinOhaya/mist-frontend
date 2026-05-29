import type { ReactNode } from "react";
import ChatRoomContext from "./chatRoomContext";
import useChatRoomLogic from "@hooks/useChatRoomLogic";

interface ChatRoomProviderProps {
  children: ReactNode;
}

function ChatRoomProvider({ children }: ChatRoomProviderProps) {
  const chatRoomLogic = useChatRoomLogic();

  return (
    <ChatRoomContext.Provider value={chatRoomLogic}>
      {children}
    </ChatRoomContext.Provider>
  );
}

export default ChatRoomProvider;
