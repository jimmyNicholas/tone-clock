"use client";
import React, { Suspense } from "react";
import ClockFace from "@/app/components/ClockFace";
import AppHeader from "@/app/components/AppHeader";
import TabbedPanel from "@/app/components/TabbedPanel";
import AudioControls from "@/app/components/AudioControls";
import { useTime } from "@/hooks/useTime";
import { useAudio } from "@/hooks/useAudio";
import AudioOptions from "./components/InfoPanel/AudioOptions";
import TimezoneOptions from "./components/InfoPanel/TimezoneOptions";
import InstructionsContent from "./components/InfoPanel/InstructionsContent";
import AboutContent from "./components/InfoPanel/AboutContent";
import HistoryContent from "./components/InfoPanel/HistoryContent";

export default function Home() {
  const { time, selectedTimezone, setSelectedTimezone } = useTime();
  const {
    audioStarted,
    toggleAudio,
    notes,
    updateVolume,
    updateHarmonicInterval,
    updateNoteType,
  } = useAudio(time);

  const clockFaceProps = {
    hours: time ? time.getHours() % 12 : null,
    minutes: time ? time.getMinutes() : null,
    seconds: time ? time.getSeconds() : null,
    size: 500,
  };

  return (
    <div className="w-screen h-screen grid place-content-center">
      <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
        <div className="mb-8 text-center">
          <AppHeader />
          <div className="grid grid-cols-[2fr_1fr] mt-6 text-lg font-semibold text-gray-800">
            <AudioControls
              isEnabled={audioStarted}
              onToggle={toggleAudio}
            >
              <ClockFace {...clockFaceProps} />
            </AudioControls>
            <Suspense fallback={<div>Loading panel...</div>}>
              <TabbedPanel 
                  tabs={[
                    { key: "audio", label: "Audio", content: <AudioOptions 
                      notes={notes}
                      updateVolume={updateVolume}
                      updateHarmonicInterval={updateHarmonicInterval}
                      updateNoteType={updateNoteType}
                    /> },
                    { key: "timezone", label: "Timezone", content: <TimezoneOptions 
                      selectedTimezone={selectedTimezone}
                      onTimezoneChange={setSelectedTimezone}
                      currentTime={time}
                    /> },
                    { key: "instructions", label: "Instructions", content: <InstructionsContent /> },
                    { key: "history", label: "History", content: <HistoryContent /> },
                    { key: "about", label: "Who did this?", content: <AboutContent /> },
                  ]} 
                  defaultTab="audio" 
              />
            </Suspense>
          </div>
        </div>
       
      </div>
    </div>
  );
}
