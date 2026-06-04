import useChatRoom from "@contexts/chatRoom/useChatRoom";
import { IoIosArrowBack } from "react-icons/io";
import ProfilePicture from "@components/profile/ProfilePicture";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import Dropdown from "@components/shared/Dropdown";
import LeaveGroupModal from "@components/shared/modals/LeaveGroupModal";
import { AnimatePresence } from "framer-motion";
import ProfileEditor from "@components/shared/ProfileEditor";
import ChangeNameModal from "@components/shared/modals/ChangeNameModal";
import { FaGear } from "react-icons/fa6";
import GroupInfoModal from "@components/shared/modals/GroupInfoModal";

interface HeaderProps {
  onBackToChats: () => void;
}

export type ActiveOptions =
  | "changePfp"
  | "nameChange"
  | "leave"
  | "groupSettings"
  | "null";
function Header({ onBackToChats }: HeaderProps) {
  const { currentChat, currentChatId, changeName, updateGroupProfilePicture } =
    useChatRoom();

  const [activeOption, setActiveOption] = useState<ActiveOptions>("null");

  return (
    <div
      className={`flex justify-center items-center gap-2 bg-(--neutral-bg) px-2 py-2 text-(--neutral-primary-text)`}
    >
      <button
        style={{
          border: 0,
          background: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => {
          if (typeof onBackToChats === "function") {
            onBackToChats();
          }
        }}
      >
        <IoIosArrowBack size={24} />
      </button>
      {currentChatId && (
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            <ProfilePicture
              src={
                currentChat.isDm
                  ? currentChat.otherUser?.profilePicture?.url || null
                  : currentChat.profilePicture?.url || null
              }
              alt={
                currentChat?.isDm === true
                  ? (currentChat.otherUser?.username ?? "Loading...")
                  : currentChat.name
              }
              size={24}
            />
            <p className="min-w-0 truncate text-3xl text-(--neutral-primary-text)">
              {currentChat?.isDm === true
                ? (currentChat.otherUser?.username ?? "Loading...")
                : currentChat.name}
            </p>
          </div>
        </div>
      )}
      <Dropdown
        title="Group Settings"
        options={[
          {
            icon: <FaGear size={16} />,
            text: "Group Info",
            onClick: () => setActiveOption("groupSettings"),
          },
          {
            icon: <MdPerson size={16} />,
            text: "Change group profile picture",
            onClick: () => setActiveOption("changePfp"),
          },
          {
            icon: <FaPencilAlt size={11} />,
            text: "Change Group Name",
            onClick: () => setActiveOption("nameChange"),
          },
          {
            bg: "(--p300)",
            text: "Leave group",
            onClick: () => setActiveOption("leave"),
          },
        ]}
      />
      <AnimatePresence>
        {activeOption === "leave" && (
          <LeaveGroupModal
            key="leave-group-modal"
            trigger={() => setActiveOption("null")}
          />
        )}
        {activeOption === "changePfp" && (
          <ProfileEditor
            title={"Change group photo"}
            trigger={() => setActiveOption("null")}
            onUpload={async (file) => updateGroupProfilePicture(file)}
          />
        )}
        {activeOption === "nameChange" && (
          <ChangeNameModal
            title="Change Group Name"
            trigger={() => setActiveOption("null")}
            onSubmit={async (newName) => changeName(newName)}
          />
        )}
        {activeOption === "groupSettings" && (
          <GroupInfoModal trigger={() => setActiveOption("null")} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Header;
