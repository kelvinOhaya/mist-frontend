import { useLoadingState } from "@hooks/useLoadingState";
import { useState } from "react";
import LoadingDots from "../LoadingDots";
import { ModalButton, ModalContainer, ModalTitle } from "./modal";
import useChatRoom from "@contexts/chatRoom/useChatRoom";

type ModalWithInputProps = {
  trigger: () => void;
};

function CreateGroupModal({ trigger }: ModalWithInputProps) {
  const { loadingState, setLoadingState } = useLoadingState();
  const { createGroup } = useChatRoom();
  const [input, setInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async () => {
    if (input.length <= 0) {
      throw new Error("Please put a name for your group");
    }
    setLoadingState("pending");
    //when backend is installed:
    try {
      await createGroup(input);
      setLoadingState("success");
      trigger();
    } catch (e) {
      console.log(e);
      setErrorMsg(e as string);
    }
  };
  return (
    <ModalContainer trigger={trigger}>
      <ModalTitle>Create Group</ModalTitle>
      <input
        type="text"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        className="border-2 w-full focus:border-(--p300) border-(--neutral-secondary-text) rounded-lg outline-none transform-colors duration-200 pl-2 py-1 my-4"
      />
      {loadingState === "error" && (
        <span className="text-(--error)">{errorMsg}</span>
      )}
      {loadingState === "pending" && (
        <span className="text-(--neutral-primary-text)">
          Creating group <LoadingDots />
        </span>
      )}
      {loadingState === "success" && (
        <span className="text-(--success)">Sucessfully created!</span>
      )}
      <div className="flex gap-2 w-full">
        <ModalButton highlight={false} onClick={() => handleSubmit()}>
          <span className="whitespace-nowrap">Create Group</span>
        </ModalButton>
        <ModalButton highlight={true} onClick={() => trigger()}>
          Cancel
        </ModalButton>
      </div>
    </ModalContainer>
  );
}

export default CreateGroupModal;
