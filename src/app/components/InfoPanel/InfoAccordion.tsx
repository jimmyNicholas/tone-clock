import React, { useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface InfoAccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

const InfoAccordion: React.FC<InfoAccordionProps> = ({ items, defaultOpen = 0 }) => {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpen);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="space-y-2 text-left">
      {items.map((item, idx) => (
        <div key={item.id}>
          <button
            className={`w-full text-left px-4 py-2 font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${openIndex === idx ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-800 hover:bg-blue-50'}`}
            onClick={() => handleToggle(idx)}
            aria-expanded={openIndex === idx}
            aria-controls={`section-content-${item.id}`}
          >
            {item.title}
          </button>
          <div
            id={`section-content-${item.id}`}
            className={`overflow-hidden transition-all duration-200 ${openIndex === idx ? 'max-h-96 py-2 px-4' : 'max-h-0 py-0 px-4'}`}
            style={{
              opacity: openIndex === idx ? 1 : 0,
              pointerEvents: openIndex === idx ? 'auto' : 'none',
            }}
            aria-hidden={openIndex !== idx}
          >
            {openIndex === idx && (
              <div className="text-gray-700 text-sm">
                {item.content}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoAccordion;
