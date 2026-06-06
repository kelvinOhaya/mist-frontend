import { AnimatePresence, motion } from "framer-motion";
import { format, isSameDay, isSameWeek, isToday, isYesterday } from "date-fns";
import { useCallback, useEffect, useMemo } from "react";
import { slideTiming } from "@utils/animationTiming";
import useChatRoom from "@contexts/chatRoom/useChatRoom";
import useAuth from "@contexts/auth/useAuth";
import TextBar from "../chat-room/TextBar";
import Message from "../chat-room/Message";
import Chats from "./Chats";
import Account from "./Account";
import type { TabOptions } from "./Navbar";
import Header from "./Header";
import Search from "./Search";

const ChatMessage = Message as any;
interface ActivePaneProps {
  activeTab: TabOptions;
  isInChatView: boolean;
  setIsInChatView: React.Dispatch<React.SetStateAction<boolean>>;
}

function ActivePane({
  activeTab,
  isInChatView,
  setIsInChatView,
}: ActivePaneProps) {
  const { currentChatId, messages, currentChat } = useChatRoom();
  const { user } = useAuth();

  const panes = useMemo(
    () => ({
      chats: <Chats onOpenChat={() => setIsInChatView(true)} />,
      account: <Account />,
      search: <Search />,
    }),
    [setIsInChatView],
  );

  const showChatPane = isInChatView && !!currentChatId;

  useEffect(() => {
    if (currentChatId) return;
    if (isInChatView) {
      setIsInChatView(false);
    }
  }, [currentChatId, isInChatView, setIsInChatView]);

  const showMessages = (message: any, index: number) => {
    const currentDate = new Date(message.createdAt);
    const prevDate = index > 0 ? new Date(messages[index - 1].createdAt) : null;
    const showDivider = !prevDate || !isSameDay(prevDate, currentDate);

    return (
      <div key={message._id || index} className="flex w-full flex-col">
        <span className="text-center text-sm text-(--neutral-secondary-text) opacity-90">
          {showDivider
            ? isToday(currentDate)
              ? "Today"
              : isYesterday(currentDate)
                ? "Yesterday"
                : isSameWeek(currentDate, new Date())
                  ? format(currentDate, "EEEE")
                  : format(currentDate, "MMMM dd, yyyy")
            : null}
        </span>
        <ChatMessage
          isSender={user.username === message.sender.username}
          message={message}
        />
      </div>
    );
  };

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={showChatPane ? "chat" : activeTab}
          className="absolute inset-0 overflow-y-auto"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.18, ease: slideTiming as any }}
        >
          {showChatPane ? (
            <div className="relative flex h-full flex-col overflow-hidden">
              <Header onBackToChats={() => setIsInChatView(false)} />
              <div className="flex-1 overflow-y-auto px-2.5 pt-5 pb-24 scrollbar-none">
                {messages?.map(showMessages)}
              </div>
              {currentChatId &&
                currentChat.joinCode !== "Hiubuw" &&
                currentChatId.name !== "Welcome Page" && <TextBar />}
            </div>
          ) : (
            panes[activeTab]
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ActivePane;
