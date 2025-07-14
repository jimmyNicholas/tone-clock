import ClockFace from "./components/ClockFace";
import VolumeControls from "./components/VolumeControls";
import AudioControls from "./components/AudioControls";
import TimeDisplay from "./components/TimeDisplay";
import AppHeader from "./components/AppHeader";
import { useTime } from "./hooks/useTime";
import { useAudio } from "./hooks/useAudio";

const Clock = () => {
  const { time, mounted, selectedTimezone, setSelectedTimezone } = useTime();
  const {
    audioStarted,
    toggleAudio,
    volumes,
    updateVolume,
  } = useAudio(time, mounted);

  const clockFaceProps = {
    hours: time ? time.getHours() % 12 : null,
    minutes: time ? time.getMinutes() : null,
    seconds: time ? time.getSeconds() : null,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <div className="mb-8 text-center">
        <AppHeader />

        <AudioControls
          audioStarted={audioStarted}
          onToggleAudio={toggleAudio}
        />

        <ClockFace {...clockFaceProps} />

        <VolumeControls
          volumes={volumes}
          updateVolume={updateVolume}
        />
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
