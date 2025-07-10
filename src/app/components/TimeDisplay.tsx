interface TimeDisplayProps {
  time: Date | null;
  chordMode: boolean;
  selectedTimezone: number;
  onTimezoneChange: (timezone: number) => void;
}

// Generate GMT timezone options from -12 to +12
const generateTimezoneOptions = () => {
  const options = [];
  for (let i = -12; i <= 12; i++) {
    const sign = i >= 0 ? '+' : '';
    const label = `GMT ${sign}${i}`;
    const value = i;
    options.push({ label, value });
  }
  return options;
};

const TimeDisplay = ({ time, chordMode, selectedTimezone, onTimezoneChange }: TimeDisplayProps) => {
  const timezoneOptions = generateTimezoneOptions();

  return (
    <div className="mt-8 text-center">
      {/* Timezone Selector */}
      <div className="mb-4">
        <label htmlFor="timezone-select" className="text-sm text-gray-600 mr-2">
          Timezone:
        </label>
        <select
          id="timezone-select"
          value={selectedTimezone}
          onChange={(e) => onTimezoneChange(Number(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {timezoneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time Display */}
      <div className="text-2xl font-mono text-gray-800">
        {time?.toLocaleTimeString()}
      </div>
      
      {/* Hand Indicators */}
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
      
      {/* Description */}
      <div className="text-xs text-gray-500 mt-1">
        {chordMode
          ? "Chord mode adds harmonious 3rd and 5th with smooth voice leading"
          : "Minute frequency changes every second within each minute"}
      </div>
    </div>
  );
};

export default TimeDisplay;