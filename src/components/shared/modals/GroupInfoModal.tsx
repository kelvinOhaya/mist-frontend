import useChatRoom from "@contexts/chatRoom/useChatRoom";
import {
  Modal,
  ModalButton,
  ModalTitle,
  ModalContainer,
  ModalDescription,
} from "./modal";
import InfoTab from "../InfoTab";

interface GroupInfoModalProps {
  trigger: () => void;
}

function GroupInfoModal({ trigger }: GroupInfoModalProps) {
  const { currentChat } = useChatRoom();
  return (
    <ModalContainer trigger={trigger}>
      <ModalTitle>{currentChat.name}</ModalTitle>
      <div className="w-full flex flex-col items-start">
        <span>Join Code</span>
        <div
          className="
         border-2 border-(--neutral-accent) rounded-lg flex items-center justify-center w-full"
        >
          <span>{currentChat.joinCode}</span>
        </div>
      </div>
      <ModalButton onClick={trigger} highlight>
        Exit
      </ModalButton>
    </ModalContainer>
  );
}

export default GroupInfoModal;
