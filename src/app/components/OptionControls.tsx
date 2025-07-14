import { OptionsItem } from "../hooks/useOptions";

interface OptionControlsProps {
  options: OptionsItem[];
  updateVolume: (noteName: string, newVolume: number) => void;
  updateHarmonicInterval: (noteName: string, interval: number) => void;
}

const OptionControls = ({
  options,
  updateVolume,
  updateHarmonicInterval,
}: OptionControlsProps) => {
  const harmonicIntervalOptions = [
    { value: 0, label: "Unison" },
    { value: 3, label: "Minor Third" },
    { value: 4, label: "Major Third" },
    { value: 5, label: "Perfect Fourth" },
    { value: 7, label: "Perfect Fifth" },
    { value: 8, label: "Minor Sixth" },
    { value: 9, label: "Major Sixth" },
    { value: 12, label: "Octave" },
  ];

  const formatNoteName = (noteName: string): string => {
    const nameMap: { [key: string]: string } = {
      hour: "Hour Hand",
      minute: "Minute Hand", 
      harmonyOne: "Harmony One",
      harmonyTwo: "Harmony Two",
    };
    return nameMap[noteName] || noteName.charAt(0).toUpperCase() + noteName.slice(1);
  };

  return (
    <div className="grid grid-cols-2 gap-6 justify-center items-center flex-wrap">
      {options.length > 0 ? (
        options.map(({ noteName, volume, harmonicInterval }, index) => (
          <div key={index} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-700">
              {formatNoteName(noteName)}
            </label>
            
            {/* Volume Control */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600">Volume</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">🔇</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) =>
                    updateVolume(noteName, parseFloat(e.target.value))
                  }
                  className="w-20 accent-red-500"
                />
                <span className="text-xs text-gray-500">🔊</span>
              </div>
              <span className="text-xs text-gray-600">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Harmonic Interval Control (only for harmony notes) */}
            {harmonicInterval !== undefined && (
              <div className="flex flex-col items-center gap-2">
                <select
                  value={harmonicInterval}
                  onChange={(e) =>
                    updateHarmonicInterval(noteName, parseInt(e.target.value))
                  }
                  className="text-xs p-2 border border-gray-300 rounded bg-white min-w-[120px]"
                >
                  {harmonicIntervalOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">
                  {harmonicInterval === 0 ? "Base note" : `+${harmonicInterval} semitones`}
                </span>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-gray-500">No audio controls available</div>
      )}
    </div>
  );
};

export default OptionControls;