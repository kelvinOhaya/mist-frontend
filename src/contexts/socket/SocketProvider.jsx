import useSocketLogic from "@hooks/useSocketLogic";
import SocketContext from "./socketContext";

function SocketProvider({ children }) {
  const { socket } = useSocketLogic();

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
