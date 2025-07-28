import React from "react";
import InfoHeader from "./UI/InfoHeader";
import InfoAccordion from "./UI/InfoAccordion";
import InfoParagraph from "./UI/InfoParagraph";

const instructions = [
  {
    id: "overview",
    title: "What is it?",
    content: (
      <InfoParagraph><span className="font-semibold">Tone Clock</span> is an innovative audio timepiece that transforms the current time into a continuous musical soundscape. The app maps the positions of clock hands (hour and minute) to musical pitches, creating an ambient sonic representation of time that changes throughout the day.</InfoParagraph>
    ),
  },
  {
    id: "enable-sound",
    title: "How do I start the audio?",
    content: (
      <InfoParagraph><span className="font-semibold">Enabling Sound:</span> Click the <span className="font-mono">clock face area</span> (with the frosted overlay) to enable sound. Due to browser autoplay restrictions, the app cannot start playing sound automatically. When sound is disabled, a frosted overlay with &quot;Sound Disabled&quot; and &quot;Click to enable&quot; is shown. Once enabled, the overlay disappears and the clock is interactive.</InfoParagraph>
    ),
  },
  {
    id: "hour-minute-toggle",
    title: "What does the hour and minute toggle do?",
    content: (
      <InfoParagraph><span className="font-semibold">Hour/Minute Toggle:</span> Each of the four tones can be set to track either the hour hand or minute hand position on the clock. When set to &quot;Hour,&quot; the tone&apos;s pitch changes based on the hour hand&apos;s position (completing a full cycle every 12 hours). When set to &quot;Minute,&quot; the tone&apos;s pitch changes based on the minute hand&apos;s position (completing a full cycle every 60 minutes). This allows you to create complex harmonic relationships as different tones track different aspects of time.</InfoParagraph>
    ),
  },
  {
    id: "volume-controls",
    title: "How do I adjust the volume?",
    content: (
      <InfoParagraph><span className="font-semibold">Volume Controls:</span> Each tone has its own volume slider (0-100%) allowing you to balance the four tones to create your desired mix. Use the sliders to adjust individual tone volumes.</InfoParagraph>
    ),
  },
  {
    id: "pitch-controls",
    title: "How do I adjust the pitch?",
    content: (
      <InfoParagraph><span className="font-semibold">Pitch Controls:</span> Use the interval slider or quick interval buttons (e.g., +12, -12) to adjust each tone&apos;s base pitch in semitones. This lets you set different tones to different musical intervals, creating harmonies and chord progressions that evolve with time. The display shows the offset from the base note (e.g., &quot;+7 st&quot; creates a perfect fifth interval).</InfoParagraph>
    ),
  },
  {
    id: "timezone",
    title: "How do I change the timezone?",
    content: (
      <InfoParagraph><span className="font-semibold">Timezone Selection:</span> Use the timezone dropdown in the &quot;Timezone&quot; tab to set your local time zone (GMT -12 to GMT +12), ensuring the musical representation accurately reflects your current local time.</InfoParagraph>
    ),
  },
];

const InstructionsContent: React.FC = () => (
  <div className="flex-1 w-96 text-left space-y-4 text-sm">
    <InfoHeader>Instructions</InfoHeader>
    <InfoAccordion items={instructions} defaultOpen={0} />
  </div>
);

export default InstructionsContent; 