import { Modal } from "./modal";

interface LogoutModalProps {
  trigger: () => void;
}
function LogoutModal({ trigger }: LogoutModalProps) {
  return (
    <Modal
      title="Logout"
      trigger={() => trigger()}
      description="Are you sure you want to log out?"
      buttons={[
        {
          text: "Yes",
          highlight: false,
          onClick: () => {
            console.log("Logged out");
          },
        },
        {
          text: "No",
          highlight: true,
          onClick: () => trigger(),
        },
      ]}
    />
  );
}

export default LogoutModal
