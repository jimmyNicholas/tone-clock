interface AudioControlsProps {
  audioStarted: boolean;
  chordMode: boolean;
  onToggleAudio: () => void;
  onToggleChordMode: () => void;
}

const AudioControls = ({
  audioStarted,
  chordMode,
  onToggleAudio,
  onToggleChordMode,
}: AudioControlsProps) => {
  return (
    <div className="flex gap-4 justify-center mb-6">
      <button
        onClick={onToggleAudio}
        className={`px-6 py-2 rounded-lg transition-colors ${
          audioStarted
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {audioStarted ? "Disable Sound" : "Enable Sound"}
      </button>

      <button
        onClick={onToggleChordMode}
        className={`px-6 py-2 rounded-lg transition-colors ${
          chordMode
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
        }`}
        disabled={false}
      >
        {chordMode ? "Chord Mode: ON" : "Chord Mode: OFF"}
      </button>
    </div>
  );
};

export default AudioControls;