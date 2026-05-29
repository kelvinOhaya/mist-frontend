import useChatRoom from "@contexts/chatRoom/useChatRoom";
import ProfilePicture from "@components/shared/ProfilePicture";

interface ChatsProps {
  onOpenChat: () => void;
}

function Chats({ onOpenChat }: ChatsProps) {
  const { chatRooms, currentChatId, activateChat, messagesCache } =
    useChatRoom();
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <span className=" pb-2 text-3xl">Chats</span>
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
                    console.log(JSON.stringify(messagesCache, null, 2));
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
    </div>
  );
}

export default Chats;
