import useChatRoom from "@contexts/chatRoom/useChatRoom";
import {
  Modal,
  ModalButton,
  ModalContainer,
  ModalDescription,
  ModalTitle,
} from "./modal";

interface LeaveGroupProps {
  trigger: () => void;
  isDm: boolean;
}
function LeaveGroupModal({ trigger }: LeaveGroupProps) {
  const { currentChat, leaveChatRoom, setIsInChatView } = useChatRoom();
  return (
    <ModalContainer trigger={() => trigger()}>
      <ModalTitle>{currentChat.isDm ? "Leave Chat" : "Leave Group"}</ModalTitle>
      <ModalDescription>
        <div className="flex flex-col gap-2 items-center">
          <span>
            {currentChat.isDm
              ? "Are you sure you want to leave the chat?"
              : "Are you sure you want to leave the group?"}
          </span>
          {currentChat.members.length === 0 && (
            <span className=" block text-(--error) text-center">
              Warning: You are the last member of this{" "}
              {currentChat.isDm ? "chat" : "group"}. All chats will be lost
              permanently if you leave!
            </span>
          )}
        </div>
      </ModalDescription>
      <div className="flex justify-between w-full gap-2">
        <ModalButton
          highlight={false}
          onClick={async () => {
            setIsInChatView(false);
            await leaveChatRoom();
          }}
        >
          Leave
        </ModalButton>
        <ModalButton onClick={() => trigger()} highlight>
          Cancel
        </ModalButton>
      </div>
    </ModalContainer>
    // <Modal
    //   title="Leave Group"
    //   trigger={() => trigger()}
    //   description={`${isDm?"Are you sure you want to leave the chat?":"Are you sure you want to leave the group?"}`}
    //   buttons={[
    //     {
    //       text: "Leave Group",
    //       highlight: false,
    //       onClick: () => {
    //         console.log("Left the group");
    //       },
    //     },
    //     {
    //       text: "Cancel",
    //       highlight: true,
    //       onClick: () => {
    //         trigger();
    //       },
    //     },
    //   ]}
    // />
  );
}

export default LeaveGroupModal;
