import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface TabConfig {
  key: string;
  label: string;
  content: ReactNode;
}

interface TabbedPanelProps {
  tabs: TabConfig[];
  defaultTab: string;
}

export const TabbedPanel: React.FC<TabbedPanelProps> = ({ tabs, defaultTab }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const TAB_KEYS = tabs.map(tab => tab.key);

  // Get initial tab from query string, default to defaultTab
  const getInitialTab = (): string => {
    const tabParam = searchParams.get("tab");
    return tabParam && TAB_KEYS.includes(tabParam) ? tabParam : defaultTab;
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const firstTabRef = useRef<HTMLButtonElement | null>(null);
  const [liveMessage, setLiveMessage] = useState<string>("");

  useEffect(() => {
    firstTabRef.current?.focus();
  }, []);

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.key === activeTab);
    if (currentTab) {
      setLiveMessage(`${currentTab.label} tab selected`);
    }
  }, [activeTab, tabs]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && TAB_KEYS.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
    if (!tabParam && activeTab !== defaultTab) {
      setActiveTab(defaultTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (tabKey === defaultTab) {
      params.delete("tab");
    } else {
      params.set("tab", tabKey);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm p-0 w-full max-w-lg mx-auto flex flex-col h-136">
      {/* ARIA live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>{liveMessage}</div>
      {/* Tab Content */}
      <div className="flex-1 p-6 pr-8 mx-0.5 bg-white flex flex-col justify-start rounded-t-lg overflow-y-scroll">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            id={`tabpanel-${tab.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.key}`}
            hidden={activeTab !== tab.key}
            tabIndex={0}
            className={activeTab === tab.key ? "flex-1 min-w-96" : "hidden"}
          >
            {tab.content}
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <nav
        className="flex border-t bg-gray-50 rounded-b-lg overflow-x-auto"
        role="tablist"
        aria-label="Information panel tabs"
      >
        {tabs.map((tab, idx) => (
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
                const next = (idx + 1) % tabs.length;
                document.getElementById(`tab-${tabs[next].key}`)?.focus();
                handleTabClick(tabs[next].key);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                const prev = (idx - 1 + tabs.length) % tabs.length;
                document.getElementById(`tab-${tabs[prev].key}`)?.focus();
                handleTabClick(tabs[prev].key);
              } else if (e.key === "Home") {
                e.preventDefault();
                document.getElementById(`tab-${tabs[0].key}`)?.focus();
                handleTabClick(tabs[0].key);
              } else if (e.key === "End") {
                e.preventDefault();
                document.getElementById(`tab-${tabs[tabs.length - 1].key}`)?.focus();
                handleTabClick(tabs[tabs.length - 1].key);
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