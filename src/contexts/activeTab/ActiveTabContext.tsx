import { createContext } from "react";

export type ActiveTab = "Home" | "Login" | "Chatroom";

export interface ActiveTabContextValue {
  activeTab: ActiveTab;
  navigate: (tab: ActiveTab) => void;
}

const ActiveTabContext = createContext<ActiveTabContextValue | 0>(0);
export default ActiveTabContext;
