import React, { useState } from "react";

interface InstructionSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const instructions: InstructionSection[] = [
  {
    id: "overview",
    title: "What is it?",
    content: (
      <p><span className="font-semibold">Tone Clock</span> is an innovative audio timepiece that transforms the current time into a continuous musical soundscape. The app maps the positions of clock hands (hour and minute) to musical pitches, creating an ambient sonic representation of time that changes throughout the day.</p>
    ),
  },
  {
    id: "enable-sound",
    title: "How do I start the audio?",
    content: (
      <p><span className="font-semibold">Enabling Sound:</span> Click the &quot;Enable Sound&quot; button at the top of the interface to activate audio playback. This must be done due to browser autoplay restrictions - the app cannot start playing sound automatically.</p>
    ),
  },
  {
    id: "hour-minute-toggle",
    title: "What does the hour and minute toggle do?",
    content: (
      <p><span className="font-semibold">Hour/Minute Toggle:</span> Each of the four tones can be set to track either the hour hand or minute hand position on the clock. When set to &quot;Hour,&quot; the tone&apos;s pitch changes based on the hour hand&apos;s position (completing a full cycle every 12 hours). When set to &quot;Minute,&quot; the tone&apos;s pitch changes based on the minute hand&apos;s position (completing a full cycle every 60 minutes). This allows you to create complex harmonic relationships as different tones track different aspects of time.</p>
    ),
  },
  {
    id: "volume-controls",
    title: "How do I adjust the volume?",
    content: (
      <p><span className="font-semibold">Volume Controls:</span> Each tone has its own volume slider (0-100%) allowing you to balance the four tones to create your desired mix. Use the speaker icons or drag the sliders to adjust individual tone volumes.</p>
    ),
  },
  {
    id: "pitch-controls",
    title: "How do I adjust the pitch?",
    content: (
      <p><span className="font-semibold">Pitch Controls:</span> The + and - buttons adjust each tone&apos;s base pitch in semitones. This lets you set different tones to different musical intervals, creating harmonies and chord progressions that evolve with time. The display shows the offset from the base note (e.g., &quot;+7 semitones&quot; creates a perfect fifth interval).</p>
    ),
  },
  {
    id: "timezone",
    title: "How do I change the timezone?",
    content: (
      <p><span className="font-semibold">Timezone Selection:</span> Use the timezone dropdown to set your local time zone (GMT -12 to GMT +12), ensuring the musical representation accurately reflects your current local time.
        <br />
        <select className="w-full mt-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Example: GMT +0</option>
        </select>
      </p>
    ),
  },
];

const InstructionsContent: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="space-y-2 text-left">
      {instructions.map((section, idx) => (
        <div key={section.id}>
          <button
            className={`w-full text-left px-4 py-2 font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${openIndex === idx ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-800 hover:bg-blue-50'}`}
            onClick={() => handleToggle(idx)}
            aria-expanded={openIndex === idx}
            aria-controls={`section-content-${section.id}`}
          >
            {section.title}
          </button>
          <div
            id={`section-content-${section.id}`}
            className={`w-full overflow-hidden transition-all duration-200 ${openIndex === idx ? 'max-h-96 py-2 px-4' : 'max-h-0 py-0 px-4'}`}
            style={{
              opacity: openIndex === idx ? 1 : 0,
              pointerEvents: openIndex === idx ? 'auto' : 'none',
            }}
            aria-hidden={openIndex !== idx}
          >
            {openIndex === idx && (
              <div className="text-gray-700 text-sm w-full break-words">
                {section.content}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InstructionsContent; 