import { useActiveTab } from "./../../context/ActiveTabContext";

const TabBtns = ({ displayClass }) => {
  const { activeTab, updateActiveTab } = useActiveTab();

  return (
    <div className={`tab-btns ${displayClass}`}>
      <button
        className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
        onClick={() => updateActiveTab("All")}
      >
        All
      </button>
      <button
        className={`tab-btn ${activeTab === "Active" ? "active" : ""}`}
        onClick={() => updateActiveTab("Active")}
      >
        Active
      </button>
      <button
        className={`tab-btn ${activeTab === "Completed" ? "active" : ""}`}
        onClick={() => updateActiveTab("Completed")}
      >
        Completed
      </button>
    </div>
  );
};

export default TabBtns;
