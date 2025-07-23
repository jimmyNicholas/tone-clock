import React from "react";
import ClockFace from "./components/ClockFace";
import OptionControls from "./components/OptionControls";
import AudioControls from "./components/AudioControls";
import TimeDisplay from "./components/TimeDisplay";
import AppHeader from "./components/AppHeader";
import TabbedPanel from "./components/TabbedPanel";
import { useTime } from "../hooks/useTime";
import { useAudio } from "../hooks/useAudio";

const Clock: React.FC = () => {
  const { time, mounted, selectedTimezone, setSelectedTimezone } = useTime();
  const {
    audioStarted,
    toggleAudio,
    notes,
    updateVolume,
    updateHarmonicInterval,
    updateNoteType
  } = useAudio(time, mounted);

  const clockFaceProps = {
    hours: time ? time.getHours() % 12 : null,
    minutes: time ? time.getMinutes() : null,
    seconds: time ? time.getSeconds() : null,
    size: 500,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <div className="mb-8 text-center">
        <AppHeader />

        <AudioControls
          audioStarted={audioStarted}
          onToggleAudio={toggleAudio}
        />

        <div className="grid grid-cols-[2fr_1fr] mt-6 text-lg font-semibold text-gray-800">
          <ClockFace {...clockFaceProps} />

          <TabbedPanel>
            <OptionControls
              notes={notes}
              updateVolume={updateVolume}
              updateHarmonicInterval={updateHarmonicInterval}
              updateNoteType={updateNoteType}
            />
          </TabbedPanel>
        </div>
      </div>

      {/* Time Display */}
      <TimeDisplay
        time={time}
        selectedTimezone={selectedTimezone}
        onTimezoneChange={setSelectedTimezone}
      />
    </div>
  );
};

export default Clock;
