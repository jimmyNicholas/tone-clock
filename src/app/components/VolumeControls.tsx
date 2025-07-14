interface VolumeControlsProps {
  hourVolume: number;
  minuteVolume: number;
  onHourVolumeChange: (volume: number) => void;
  onMinuteVolumeChange: (volume: number) => void;
}

const VolumeControls = ({
  hourVolume,
  minuteVolume,
  onHourVolumeChange,
  onMinuteVolumeChange,
}: VolumeControlsProps) => {
  return (
    <div className="flex gap-6 justify-center items-center flex-wrap">
      <div className="flex flex-col items-center">
        <label className="text-sm font-medium text-gray-700 mb-2">
          Hour Hand
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">🔇</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={hourVolume}
            onChange={(e) => onHourVolumeChange(parseFloat(e.target.value))}
            className="w-20 accent-red-500"
          />
          <span className="text-xs text-gray-500">🔊</span>
        </div>
        <span className="text-xs text-gray-600 mt-1">
          {Math.round(hourVolume * 100)}%
        </span>
      </div>

      <div className="flex flex-col items-center">
        <label className="text-sm font-medium text-gray-700 mb-2">
          Minute Hand (with third and fifth)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">🔇</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={minuteVolume}
            onChange={(e) => onMinuteVolumeChange(parseFloat(e.target.value))}
            className="w-20 accent-gray-700"
          />
          <span className="text-xs text-gray-500">🔊</span>
        </div>
        <span className="text-xs text-gray-600 mt-1">
          {Math.round(minuteVolume * 100)}%
        </span>
      </div>
    </div>
  );
};

export default VolumeControls;