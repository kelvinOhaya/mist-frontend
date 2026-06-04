import { useLoadingState } from "@hooks/useLoadingState";
import { ModalContainer, ModalButton, ModalTitle } from "./modal";
import { useState } from "react";
import LoadingDots from "../LoadingDots";

interface ChangeNameModalProps {
  title: string;
  onSubmit: (newName: string) => Promise<void>;
  trigger: () => void;
}

/*
PROPS: 
    * title<string> = the title of the modal
    * onSubmit () => Promise<void> = what happens when the input from the modal is submitted
    * trigger () => void = function that turns modal on or off
HOOKS:
    {loadingState, setLoadingState} = useLoadingState
STATE:
    * [newName, setNewName]<string> = input for the new name
    * [errorMsg, setErrorMsg]<string> = error message if there is one

CONST FUNCTIONS:
    handle submit () => {
        setLoadingState("pending")
    //when backend is installed:
        try {
            await onSubmit(prop)
            setLoadingState(success)
        } catch (e) {
            console.log(e)
            setErrorMsg(e)
        }
    } = function on submit
*/

function ChangeNameModal({ title, onSubmit, trigger }: ChangeNameModalProps) {
  const { loadingState, setLoadingState } = useLoadingState();
  const [newName, setNewName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async () => {
    setLoadingState("pending");
    //when backend is installed:
    try {
      await onSubmit(newName);
      setLoadingState("success");
      trigger();
    } catch (e) {
      console.log(e);
      setErrorMsg(e as string);
    }
  };
  return (
    <ModalContainer trigger={trigger}>
      <ModalTitle>{title}</ModalTitle>
      <input
        type="text"
        onChange={(e) => setNewName(e.target.value)}
        value={newName}
        className="border-2 w-full focus:border-(--p300) border-(--neutral-secondary-text) rounded-lg outline-none transform-colors duration-200 pl-2 py-1 my-4"
      />
      {loadingState === "error" && (
        <span className="text-(--error)">{errorMsg}</span>
      )}
      {loadingState === "pending" && (
        <span className="text-(--neutral-primary-text)">
          Changing name <LoadingDots />
        </span>
      )}
      {loadingState === "success" && (
        <span className="text-(--success)">Name successfully Changed!</span>
      )}
      <div className="flex gap-2 w-full">
        <ModalButton highlight={false} onClick={() => handleSubmit()}>
          <span className="whitespace-nowrap">Change name</span>
        </ModalButton>
        <ModalButton highlight={true} onClick={() => trigger()}>
          Cancel
        </ModalButton>
      </div>
    </ModalContainer>
  );
}

export default ChangeNameModal;
