import React, { useState, useEffect, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AboutContent from "./InfoPanel/AboutContent";
import HistoryContent from "./InfoPanel/HistoryContent";
import InstructionsContent from "./InfoPanel/InstructionsContent";

interface TabbedPanelProps {
  children: ReactNode; // Content for the Options tab
}

const TABS = [
  { key: "options", label: "Options" },
  { key: "instructions", label: "Instructions" },
  { key: "history", label: "History" },
  { key: "about", label: "Who did this?" },
];

const TAB_KEYS = TABS.map(tab => tab.key);

export const TabbedPanel: React.FC<TabbedPanelProps> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial tab from query string, default to 'options'
  const getInitialTab = (): string => {
    const tabParam = searchParams.get("tab");
    return tabParam && TAB_KEYS.includes(tabParam) ? tabParam : "options";
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());

  // Update activeTab if the query string changes (e.g. browser navigation)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && TAB_KEYS.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
    if (!tabParam && activeTab !== "options") {
      setActiveTab("options");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // When tab changes, update the query string (shallow push)
  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (tabKey === "options") {
      params.delete("tab");
    } else {
      params.set("tab", tabKey);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm p-0 w-full max-w-lg mx-auto flex flex-col h-136">
      {/* Tab Content */}
      <div className="flex-1 p-6 pr-8 mx-0.5 bg-white flex flex-col justify-start rounded-t-lg overflow-y-scroll">
        {activeTab === "options" && <div className="flex-1 w-96">{children}</div>}
        {activeTab === "instructions" && (
          <div className="flex-1 w-96">
            <InstructionsContent />
          </div>
        )}
        {activeTab === "history" && (
          <HistoryContent />
        )}
        {activeTab === "about" && (
          <AboutContent />
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
            onClick={() => handleTabClick(tab.key)}
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