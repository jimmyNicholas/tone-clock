interface TimeDisplayProps {
  time: Date | null;
  selectedTimezone: number;
  onTimezoneChange: (timezone: number) => void;
}

// Generate GMT timezone options from -12 to +12
const generateTimezoneOptions = () => {
  const options = [];
  for (let i = -12; i <= 12; i++) {
    const sign = i >= 0 ? "+" : "";
    const label = `GMT ${sign}${i}`;
    const value = i;
    options.push({ label, value });
  }
  return options;
};

const TimeDisplay = ({
  time,
  selectedTimezone,
  onTimezoneChange,
}: TimeDisplayProps) => {
  const timezoneOptions = generateTimezoneOptions();

  return (
    <div className="flex mt-4 text-center">

      {/* Timezone Selector */}
      <div className="mb-4 p-4">
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
      <div className="text-2xl font-mono text-gray-800 p-4">
        {time?.toLocaleTimeString()}
      </div>

      
    </div>
  );
};

export default TimeDisplay;
