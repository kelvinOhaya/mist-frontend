import styles from "./LogoutConfirmation.module.css";
import useChatRoom from "../../../../../../contexts/chatRoom/useChatRoom";
import useAuth from "../../../../../../contexts/auth/useAuth";
import { useContext } from "react";
import DropdownContext from "../../Dropdown/DropdownContext";
import { useNavigate } from "react-router-dom";

function LogoutConfirmation() {
  const { logout, setUser } = useAuth();
  const navigate = useNavigate();
  const { closePanel } = useContext(DropdownContext);
  const {
    setIsCreator,
    setChatRooms,
    setCurrentChatId,
    setMessages,
    clearAllCache,
  } = useChatRoom();

  const handleLogout = async () => {
    setIsCreator(null);
    setChatRooms(null);
    setCurrentChatId(null);
    setMessages(null);
    setUser(null);
    clearAllCache();
    await logout();
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <p>Are you sure you want to log out?</p>
      <div className={styles.buttonContainer}>
        <button type="button" onClick={() => closePanel()}>
          Nah, I'll Stay :)
        </button>
        <button type="button" onClick={() => handleLogout()}>
          Yes I'll go :(
        </button>
      </div>
    </div>
  );
}

export default LogoutConfirmation;
