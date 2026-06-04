import { Modal } from "./modal";
import useAuth from "@contexts/auth/useAuth";

interface LogoutModalProps {
  trigger: () => void;
}

function LogoutModal({ trigger }: LogoutModalProps) {
  const { logout } = useAuth();

  return (
    <Modal
      title="Logout"
      trigger={() => trigger()}
      description="Are you sure you want to log out?"
      buttons={[
        {
          text: "Yes",
          highlight: false,
          onClick: async () => {
            await logout();
            trigger();
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

export default LogoutModal;
