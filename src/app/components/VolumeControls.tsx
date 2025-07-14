import { VolumesItem } from "../hooks/useVolume";

interface VolumeControlsProps {
  updateVolume: (noteName: string, newVolume: number) => void;
  volumes: VolumesItem[];
}

const VolumeControls = ({
 
  updateVolume,
  volumes,
}: VolumeControlsProps) => {
  return (
    <div className="flex gap-6 justify-center items-center flex-wrap">
      {volumes ? volumes.map(({ noteName, volume }, index) => (
        <div key={index} className="flex flex-col items-center">
          <label className="text-sm font-medium text-gray-700 mb-2">
            {noteName.charAt(0).toUpperCase() + noteName.slice(1)} Hand
          </label>
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
          <span className="text-xs text-gray-600 mt-1">
            {Math.round(volume * 100)}%
          </span>
        </div>
      )) : (
        <div className="text-gray-500">No volume controls available</div>
      )}
    </div>
  );
};

export default VolumeControls;
            