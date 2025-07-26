import React from 'react';

interface TimezoneOptionsProps {
  selectedTimezone: number;
  onTimezoneChange: (timezone: number) => void;
  currentTime: Date | null;
}

// Helper function to get major cities for timezone
const getTimezoneCities = (offset: number): string => {
  const cities: { [key: number]: string } = {
    [-12]: "Baker Island, Howland Island",
    [-11]: "American Samoa, Niue",
    [-10]: "Hawaii, Tahiti",
    [-9]: "Alaska, Anchorage",
    [-8]: "Los Angeles, Vancouver",
    [-7]: "Denver, Phoenix",
    [-6]: "Chicago, Mexico City",
    [-5]: "New York, Toronto",
    [-4]: "Santiago, Caracas",
    [-3]: "São Paulo, Buenos Aires",
    [-2]: "Fernando de Noronha",
    [-1]: "Azores, Cape Verde",
    [0]: "London, Lisbon",
    [1]: "Paris, Berlin",
    [2]: "Cairo, Helsinki",
    [3]: "Moscow, Istanbul",
    [4]: "Dubai, Baku",
    [5]: "Tashkent, Karachi",
    [6]: "Almaty, Dhaka",
    [7]: "Bangkok, Jakarta",
    [8]: "Beijing, Singapore",
    [9]: "Tokyo, Seoul",
    [10]: "Sydney, Melbourne",
    [11]: "Solomon Islands",
    [12]: "Auckland, Fiji"
  };
  return cities[offset] || "Unknown region";
};

const generateTimezoneOptions = () => {
  return Array.from({ length: 25 }, (_, i) => i - 12).map((offset) => {
    const sign = offset >= 0 ? "+" : "";
    const label = `GMT ${sign}${offset}`;
    return {
      value: offset,
      label,
      cities: getTimezoneCities(offset)
    };
  });
};

const TimezoneOptions: React.FC<TimezoneOptionsProps> = ({
  selectedTimezone,
  onTimezoneChange,
  currentTime,
}) => {
  const timezoneOptions = generateTimezoneOptions();

  return (
    <div className="space-y-4">
      {/* Current Time Display */}
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Current Time</div>
        <div className="text-2xl font-mono text-gray-800">
          {currentTime?.toLocaleTimeString()}
        </div>
      </div>
      
      {/* Timezone Selector */}
      <div>
        <label htmlFor="timezone-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Timezone
        </label>
        <select
          id="timezone-select"
          value={selectedTimezone}
          onChange={(e) => onTimezoneChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {timezoneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.cities}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimezoneOptions; 