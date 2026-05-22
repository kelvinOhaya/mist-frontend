import { useContext } from "react";
import ActiveTabContext from "./ActiveTabContext";

export default function useActiveTab() {
  const context = useContext(ActiveTabContext);

  if (!context) {
    throw new Error("useActiveTab must be used within ActiveTabProvider");
  }

  return context;
}
