import ClockFace from "./components/ClockFace";
import VolumeControls from "./components/VolumeControls";
import AudioControls from "./components/AudioControls";
import TimeDisplay from "./components/TimeDisplay";
import AppHeader from "./components/AppHeader";
import { useTime } from "./hooks/useTime";
import { useAudio } from "./hooks/useAudio";

const Clock = () => {
  const { time, mounted } = useTime();
  const {
    audioStarted,
    chordMode,
    hourVolume,
    minuteVolume,
    toggleAudio,
    toggleChordMode,
    setHourVolume,
    setMinuteVolume,
  } = useAudio(time, mounted);

  const clockFaceProps = {
    hours: time ? time.getHours() % 12 : null,
    minutes: time ? time.getMinutes() : null,
    seconds: time ? time.getSeconds() : null,
    chordMode: chordMode,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <div className="mb-8 text-center">
        <AppHeader />

        <AudioControls
          audioStarted={audioStarted}
          chordMode={chordMode}
          onToggleAudio={toggleAudio}
          onToggleChordMode={toggleChordMode}
        />

        <ClockFace {...clockFaceProps} />

        <VolumeControls
          hourVolume={hourVolume}
          minuteVolume={minuteVolume}
          onHourVolumeChange={setHourVolume}
          onMinuteVolumeChange={setMinuteVolume}
        />
      </div>

      <TimeDisplay time={time} chordMode={chordMode} />
    </div>
  );
};

export default Clock;
