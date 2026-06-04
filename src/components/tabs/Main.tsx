import { motion } from "framer-motion";
import { MdPerson } from "react-icons/md";
import { TbMessage, TbSearch } from "react-icons/tb";
import { ReactNode } from "react";
import { slideTiming } from "@utils/animationTiming";
import { TabOptions } from "./Navbar";
import useAuth from "@contexts/auth/useAuth";
import useChatRoom from "@contexts/chatRoom/useChatRoom";
import ProfilePicture from "@components/profile/ProfilePicture";
import UserProfile from "@components/profile/UserProfile";

interface MainProps {
  setActiveTab: React.Dispatch<React.SetStateAction<TabOptions>>;
  activeTab: TabOptions;
  setIsInChatView: React.Dispatch<React.SetStateAction<boolean>>;
}
function Main({ setActiveTab, activeTab, setIsInChatView }: MainProps) {
  const { user } = useAuth();
  const { currentChatId } = useChatRoom();
  return (
    <motion.aside
      transition={{ duration: 0.22, ease: slideTiming as any }}
      className="order-last flex h-16 w-full bg-black shrink-0 flex-row   sm:order-first sm:h-full sm:max-w-fit sm:flex-col px-2"
    >
      <div className="flex w-full flex-1 items-center justify-between gap-1 px-2 sm:mt-2 sm:flex-col sm:justify-start sm:px-0">
        <Option
          icon={<UserProfile size={24} />}
          text={"Account"}
          active={activeTab === "account"}
          onClick={() => {
            setActiveTab("account");
            setIsInChatView(false);
          }}
        />
        <Option
          icon={<TbMessage size={24} />}
          text={"Chats"}
          active={activeTab === "chats"}
          onClick={() => {
            setActiveTab("chats");
            setIsInChatView(!!currentChatId);
          }}
        />
        <Option
          icon={<TbSearch size={24} />}
          text={"search"}
          active={activeTab === "search"}
          onClick={() => {
            setActiveTab("search");
            setIsInChatView(false);
          }}
        />
      </div>
    </motion.aside>
  );
}

interface OptionsProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}

function Option({ icon, text, active = false, onClick }: OptionsProps) {
  return (
    <div className="flex justify-center sm:w-full">
      <motion.button
        whileHover={{ backgroundColor: "var(--neutral-border)" }}
        animate={{ backgroundColor: "rgba(0,0,0,0)" }}
        transition={{ duration: 0.16, ease: slideTiming as any }}
        className={`flex flex-col items-center  rounded-2xl px-2 py-2 text-(--neutral-primary-text) sm:w-full ${active ? "text-(--p300)" : ""} gap-0.5`}
        onClick={onClick}
        aria-label={text}
      >
        <span className="flex h-fit w-fit shrink-0 items-center justify-center rounded-full leading-none">
          <span className="flex items-center justify-center leading-none">
            {icon}
          </span>
        </span>
        <span className="text-[0.62rem] leading-none text-(--neutral-tertiary-text)">
          {text}
        </span>
      </motion.button>
    </div>
  );
}

export default Main;
