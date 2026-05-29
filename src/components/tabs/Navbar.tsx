import { motion } from "framer-motion";
import { useState } from "react";
import { slideTiming } from "@utils/animationTiming";
import Main from "./Main";
import ActivePane from "./ActivePane";

export type TabOptions = "chats" | "search" | "account";

function ActiveTabs() {
  const [activeTab, setActiveTab] = useState<TabOptions>("chats");
  const [isInChatView, setIsInChatView] = useState(false);

  return (
    <motion.div
      initial={{ x: "-100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "-100vw" }}
      transition={{ duration: 0.2, ease: slideTiming as any }}
      className="absolute top-0 left-0 z-99 flex h-full w-full overflow-hidden bg-(--neutral-bg) text-(--neutral-primary-text)"
    >
      <div className="flex h-full w-full flex-col overflow-hidden sm:flex-row">
        <Main
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsInChatView={setIsInChatView}
        />
        <ActivePane
          activeTab={activeTab}
          isInChatView={isInChatView}
          setIsInChatView={setIsInChatView}
        />
      </div>
    </motion.div>
  );
}

export default ActiveTabs;
