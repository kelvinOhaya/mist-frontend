import { Modal } from "./modal";

interface LeaveGroupProps {
  trigger: () => void;
}
function LeaveGroupModal({ trigger }: LeaveGroupProps) {
  return (
    <Modal
      title="Leave Group"
      trigger={() => trigger()}
      description="Are you sure you want to leave the group?"
      buttons={[
        {
          text: "Leave Group",
          highlight: false,
          onClick: () => {
            console.log("Left the group");
          },
        },
        {
          text: "Cancel",
          highlight: true,
          onClick: () => {
            trigger();
          },
        },
      ]}
    />
  );
}

export default LeaveGroupModal;
