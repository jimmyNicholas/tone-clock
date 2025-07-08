interface TimeDisplayProps {
  time: Date | null;
  chordMode: boolean;
}

const TimeDisplay = ({ time, chordMode }: TimeDisplayProps) => {
  return (
    <div className="mt-8 text-center">
      <div className="text-2xl font-mono text-gray-800">
        {time?.toLocaleTimeString()}
      </div>
      <div className="text-sm text-gray-600 mt-2">
        <span className="inline-block w-4 h-1 bg-red-600 mr-2"></span>
        Hour Hand:{" "}
        <span
          className={`ml-4 inline-block w-4 h-1 mr-2 ${
            chordMode ? "bg-green-600" : "bg-gray-800"
          }`}
        ></span>
        Minute Hand:{" "}
        {chordMode && (
          <span className="text-green-600 font-semibold"> + Triad</span>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {chordMode
          ? "Chord mode adds harmonious 3rd and 5th with smooth voice leading"
          : "Minute frequency changes every second within each minute"}
      </div>
    </div>
  );
};

export default TimeDisplay;