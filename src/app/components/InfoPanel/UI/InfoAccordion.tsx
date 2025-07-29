import React, { useState, useRef } from "react";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface InfoAccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

const InfoAccordion: React.FC<InfoAccordionProps> = ({
  items,
  defaultOpen = 0,
}) => {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpen);
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  const handleHeaderKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + 1) % items.length;
      headerRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - 1 + items.length) % items.length;
      headerRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      headerRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      headerRefs.current[items.length - 1]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle(idx);
    }
  };

  return (
    <div className="space-y-2 text-left" role="presentation">
      {items.map((item, idx) => (
        <div key={item.id}>
          <button
            ref={(el) => {
              headerRefs.current[idx] = el;
            }}
            id={`accordion-header-${item.id}`}
            aria-controls={`accordion-panel-${item.id}`}
            aria-expanded={openIndex === idx}
            className={`w-full text-left px-4 py-2 font-medium rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hour ${
              openIndex === idx
                ? "bg-hour/80 text-on-hour"
                : "bg-surface-light text-on-surface hover:bg-surface-light"
            }`}
            onClick={() => handleToggle(idx)}
            onKeyDown={(e) => handleHeaderKeyDown(e, idx)}
            tabIndex={0}
            role="button"
            aria-disabled="false"
          >
            {item.title}
          </button>
          <div
            id={`accordion-panel-${item.id}`}
            role="region"
            aria-labelledby={`accordion-header-${item.id}`}
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === idx ? "max-h-96 py-2 px-4" : "max-h-0 py-0 px-4"
            }`}
            style={{
              opacity: openIndex === idx ? 1 : 0,
              pointerEvents: openIndex === idx ? "auto" : "none",
            }}
            aria-hidden={openIndex !== idx}
          >
            {openIndex === idx && (
              <div className="text-on-surface text-sm">{item.content}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoAccordion;
