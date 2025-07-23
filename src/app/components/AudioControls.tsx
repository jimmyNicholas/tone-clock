import React from "react";

interface AudioControlsProps {
  audioStarted: boolean;
  onToggleAudio: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  audioStarted,
  onToggleAudio,
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
    </div>
  );
};

export default AudioControls;