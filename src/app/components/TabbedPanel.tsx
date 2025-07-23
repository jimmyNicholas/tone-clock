import React, { useState, ReactNode } from "react";

interface TabbedPanelProps {
  children: ReactNode; // Content for the Options tab
}

const TABS = [
  { key: "options", label: "Options" },
  { key: "instructions", label: "Instructions" },
  { key: "history", label: "History" },
  { key: "about", label: "Who did this?" },
];

export const TabbedPanel: React.FC<TabbedPanelProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("options");

  return (
    <div className="border rounded-lg bg-white shadow-sm p-0 w-full max-w-md mx-auto flex flex-col min-h-[420px] h-full">
      {/* Tab Content */}
      <div className="flex-1 p-6 bg-white min-h-[180px] flex flex-col justify-start rounded-t-lg">
        {activeTab === "options" && <div className="flex-1">{children}</div>}
        {activeTab === "instructions" && (
          <div className="flex-1">
            <h2 className="font-semibold mb-2">Instructions</h2>
            <p className="text-gray-700 text-sm">How to use the Tone Clock will go here.</p>
          </div>
        )}
        {activeTab === "history" && (
          <div className="flex-1">
            <h2 className="font-semibold mb-2">History</h2>
            <p className="text-gray-700 text-sm">A brief history of the project will go here.</p>
          </div>
        )}
        {activeTab === "about" && (
          <div className="flex-1">
            <h2 className="font-semibold mb-2">Who did this?</h2>
            <p className="text-gray-700 text-sm">Info about the creator will go here.</p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <nav className="flex border-t bg-gray-50 rounded-b-lg overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-t-2 focus:outline-none
              ${activeTab === tab.key
                ? "border-blue-500 text-blue-600 bg-white"
                : "border-transparent text-gray-600 hover:text-blue-500 hover:bg-gray-100"}
            `}
            onClick={() => setActiveTab(tab.key)}
            aria-selected={activeTab === tab.key}
            role="tab"
            tabIndex={activeTab === tab.key ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabbedPanel; 