import { OptionsItem } from "../hooks/useOptions";

interface OptionControlsProps {
  options: OptionsItem[];
  updateVolume: (noteName: string, newVolume: number) => void;
  updateHarmonicInterval: (noteName: string, interval: number) => void;
  updateNoteType: (noteName: string, noteType: "hour" | "minute") => void;
}

const OptionControls = ({
  options,
  updateVolume,
  updateHarmonicInterval,
  updateNoteType,
}: OptionControlsProps) => {
  const formatNoteName = (noteName: string): string => {
    const nameMap: { [key: string]: string } = {
      hour: "Hour Hand",
      minute: "Minute Hand",
      harmonyOne: "Harmony One",
      harmonyTwo: "Harmony Two",
    };
    return (
      nameMap[noteName] || noteName.charAt(0).toUpperCase() + noteName.slice(1)
    );
  };

  const handleIntervalChange = (noteName: string, newInterval: number) => {
    // Clamp the value between -24 and +24
    const clampedInterval = Math.max(-24, Math.min(24, newInterval));
    updateHarmonicInterval(noteName, clampedInterval);
  };

  const incrementInterval = (noteName: string, currentInterval: number) => {
    const newInterval = Math.min(24, currentInterval + 1);
    updateHarmonicInterval(noteName, newInterval);
  };

  const decrementInterval = (noteName: string, currentInterval: number) => {
    const newInterval = Math.max(-24, currentInterval - 1);
    updateHarmonicInterval(noteName, newInterval);
  };

  const getIntervalLabel = (interval: number): string => {
    if (interval === 0) return "Base note";
    const direction = interval > 0 ? "+" : "";
    return `${direction}${interval} semitones`;
  };

  return (
    <div className="grid grid-cols-2 gap-6 justify-center items-center flex-wrap">
      {options.length > 0 ? (
        options.map(
          ({ noteName, volume, harmonicInterval, noteType }, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg"
            >
              <label className="text-sm font-medium text-gray-700">
                {formatNoteName(noteName)}
              </label>

              {/* Note Type Toggle Switch */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex bg-gray-200 rounded-full p-1">
                  <button
                    onClick={() => updateNoteType(noteName, "hour")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      noteType === "hour"
                        ? "bg-red-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Hour
                  </button>
                  <button
                    onClick={() => updateNoteType(noteName, "minute")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      noteType === "minute"
                        ? "bg-green-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Minute
                  </button>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-600">
                  Volume
                </span>
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

              {harmonicInterval !== undefined && (
                <div className="flex flex-col items-center gap-2">

                  {/* Interval Input*/}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        decrementInterval(noteName, harmonicInterval)
                      }
                      disabled={harmonicInterval <= -24}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded text-sm font-bold transition-colors"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="-24"
                      max="24"
                      value={harmonicInterval}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        handleIntervalChange(noteName, value);
                      }}
                      className="w-20 h-8 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <button
                      onClick={() =>
                        incrementInterval(noteName, harmonicInterval)
                      }
                      disabled={harmonicInterval >= 24}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded text-sm font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs text-gray-500">
                    {getIntervalLabel(harmonicInterval)}
                  </span>
                </div>
              )}
            </div>
          )
        )
      ) : (
        <div className="col-span-2 text-center text-gray-500">
          No audio controls available
        </div>
      )}
    </div>
  );
};

export default OptionControls;
