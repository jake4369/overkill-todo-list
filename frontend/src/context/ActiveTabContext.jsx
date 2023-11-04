import { createContext, useContext, useState } from "react";

// Create a context for the active tab
const ActiveTabContext = createContext();

// Create a custom hook to access the active tab context
export const useActiveTab = () => {
  return useContext(ActiveTabContext);
};

// Create a provider component to wrap your app with the context
export const ActiveTabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("All"); // Set the default active tab to 'All'

  // Function to update the active tab
  const updateActiveTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <ActiveTabContext.Provider value={{ activeTab, updateActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};
