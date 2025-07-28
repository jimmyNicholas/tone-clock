import React from "react";

interface TimeDisplayProps {
  time: Date | null;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ time }) => {
  return (
    <div className="text-center mt-4">
      <div className="text-2xl font-mono text-gray-800 p-4">
        {time?.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default TimeDisplay;
