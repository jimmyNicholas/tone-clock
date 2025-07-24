import React, { useState, useEffect, useRef, ReactNode } from "react";
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
  const firstTabRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Move focus to the first tab on mount
    firstTabRef.current?.focus();
  }, []);

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
        {TABS.map((tab) => (
          <div
            key={tab.key}
            id={`tabpanel-${tab.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.key}`}
            hidden={activeTab !== tab.key}
            tabIndex={0}
            className={activeTab === tab.key ? "flex-1 w-96" : "hidden"}
          >
            {tab.key === "options" && activeTab === "options" && <div className="flex-1 w-96">{children}</div>}
            {tab.key === "instructions" && activeTab === "instructions" && (
              <div className="flex-1 w-96">
                <h2 className="font-semibold mb-2">Instructions</h2>
                <InstructionsContent />
              </div>
            )}
            {tab.key === "history" && activeTab === "history" && (
              <div className="flex-1 w-96">
                <h2 className="font-semibold mb-2">History</h2>
                <HistoryContent />
              </div>
            )}
            {tab.key === "about" && activeTab === "about" && (
              <div className="flex-1 w-96">
                <h2 className="font-semibold mb-2">Who did this?</h2>
                <AboutContent />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <nav
        className="flex border-t bg-gray-50 rounded-b-lg overflow-x-auto"
        role="tablist"
        aria-label="Information panel tabs"
      >
        {TABS.map((tab, idx) => (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            role="tab"
            aria-selected={activeTab === tab.key}
            aria-controls={`tabpanel-${tab.key}`}
            tabIndex={activeTab === tab.key ? 0 : -1}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-t-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${activeTab === tab.key ? "border-blue-500 text-blue-600 bg-white" : "border-transparent text-gray-600 hover:text-blue-500 hover:bg-gray-100"}`}
            onClick={() => handleTabClick(tab.key)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                const next = (idx + 1) % TABS.length;
                document.getElementById(`tab-${TABS[next].key}`)?.focus();
                handleTabClick(TABS[next].key);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                const prev = (idx - 1 + TABS.length) % TABS.length;
                document.getElementById(`tab-${TABS[prev].key}`)?.focus();
                handleTabClick(TABS[prev].key);
              } else if (e.key === "Home") {
                e.preventDefault();
                document.getElementById(`tab-${TABS[0].key}`)?.focus();
                handleTabClick(TABS[0].key);
              } else if (e.key === "End") {
                e.preventDefault();
                document.getElementById(`tab-${TABS[TABS.length - 1].key}`)?.focus();
                handleTabClick(TABS[TABS.length - 1].key);
              }
            }}
            ref={idx === 0 ? firstTabRef : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabbedPanel; 