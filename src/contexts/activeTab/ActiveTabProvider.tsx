import { ReactNode, useState } from "react";
import ActiveTabContext, { ActiveTab } from "./ActiveTabContext";

interface Props {
  children: ReactNode;
}

function ActiveTabProvider({ children }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    (localStorage.getItem("activeTab") as ActiveTab) ?? "Home",
  );
  const navigate: (tab: ActiveTab) => void = (tab: ActiveTab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };
  return (
    <ActiveTabContext.Provider value={{ activeTab, navigate }}>
      {children}
    </ActiveTabContext.Provider>
  );
}

export default ActiveTabProvider;
