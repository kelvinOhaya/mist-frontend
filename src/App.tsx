import AppRoutes from "./AppRoutes";
import ActiveTabProvider from "@contexts/activeTab/ActiveTabProvider";

function App() {
  return (
    <ActiveTabProvider>
      <AppRoutes />
    </ActiveTabProvider>
  );
}

export default App;
