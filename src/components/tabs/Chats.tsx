import useChatRoom from "@contexts/chatRoom/useChatRoom";
import ProfilePicture from "@components/profile/ProfilePicture";
import { useState } from "react";
import CreateGroupModal from "@components/shared/modals/CreateGroupModal";
import { AnimatePresence } from "framer-motion";
// import { useEffect } from "react";
// import { ChatRoom } from "src/types";

interface ChatsProps {
  onOpenChat: () => void;
}

function Chats({ onOpenChat }: ChatsProps) {
  const { chatRooms, currentChatId, activateChat, messagesCache } =
    useChatRoom();
  const [createGroupModalTrigger, setCreateGroupModalTrigger] =
    useState<boolean>(false);

  //debug log to see the current chatroom name
  // useEffect(() => {
  //   console.log(
  //     chatRooms.filter((chat: ChatRoom) => chat._id === currentChatId)[0],
  //   );
  // }, [activateChat]);

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="flex w-full justify-start sm:justify-between sm:items-center pb-2">
        <span className=" text-3xl">Chats</span>
        {/* Create group chat button */}
        <button
          className="rounded-full absolute sm:relative max-sm:bottom-8 max-sm:right-8 bg-(--p300) w-8 h-8"
          onClick={() => setCreateGroupModalTrigger(true)}
        >
          <span className="text-3xl">+</span>
        </button>
      </div>
      <div className="mr-auto flex w-full flex-col items-center gap-2.5 bg-transparent">
        {Array.isArray(chatRooms) ? (
          chatRooms
            .filter((chatRoom) => chatRoom && chatRoom._id)
            .map((chatRoom) => {
              return (
                <button
                  className={`flex gap-2 h-10 w-full px-2 py-4 items-center overflow-hidden rounded-full  transition-colors duration-200 hover:cursor-pointer hover:bg-(--neutral-border) ${currentChatId === chatRoom._id ? "bg-(--neutral-border)" : ""}`}
                  key={chatRoom._id}
                  onClick={async () => {
                    chatRoom._id !== currentChatId &&
                      (await activateChat(chatRoom));
                    onOpenChat();
                    // console.log(JSON.stringify(messagesCache, null, 2));
                  }}
                >
                  <ProfilePicture
                    size={24}
                    alt={`${chatRoom.name}'s profile picture`}
                    src={
                      chatRoom.isDm
                        ? chatRoom.otherUser?.profilePicture?.url
                        : chatRoom.profilePicture?.url
                    }
                  />
                  <span className="text-(--neutral-primary-text) text-xl">
                    {chatRoom.isDm
                      ? chatRoom.otherUser?.username
                      : chatRoom.name}
                  </span>
                </button>
              );
            })
        ) : (
          <div className="text-[1.2rem] text-white">No Chats Yet</div>
        )}
      </div>
      <AnimatePresence>
        {createGroupModalTrigger && (
          <CreateGroupModal trigger={() => setCreateGroupModalTrigger(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chats;
