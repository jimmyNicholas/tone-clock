import React from "react";
import { AudioNote, TimeType } from "@/hooks/useAudio";

interface AudioOptionsProps {
  notes: AudioNote[];
  updateVolume: (noteId: string, newVolume: number) => void;
  updateHarmonicInterval: (noteId: string, interval: number) => void;
  updateNoteType: (noteId: string, noteType: TimeType) => void;
}

const HandToggle: React.FC<{
  id: string;
  timeType: TimeType;
  updateNoteType: (noteId: string, noteType: TimeType) => void;
}> = ({ id, timeType, updateNoteType }) => (
  <div className="mb-0.5 grid grid-cols-3 items-center gap-2">
    <span className="text-sm text-gray-600">Hand:</span>
    <button
      onClick={() => updateNoteType(id, "hour")}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
        timeType === "hour"
          ? "bg-red-500 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      Hour
    </button>
    <button
      onClick={() => updateNoteType(id, "minute")}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
        timeType === "minute"
          ? "bg-green-500 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      Minute
    </button>
  </div>
);

const LabeledSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (newValue: number) => void;
  valueDisplay?: React.ReactNode;
  colorClass?: string;
  ariaLabel?: string;
}> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  valueDisplay,
  colorClass = "accent-blue-500",
  ariaLabel,
}) => (
  <div className="w-full">
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className="flex items-center gap-2 mb-0.5">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`flex-1 w-full ${colorClass}`}
        aria-label={ariaLabel || label}
      />
      {valueDisplay}
    </div>
  </div>
);

const IntervalAdjustButton: React.FC<{
    label: string;
    onClick: () => void;
    disabled: boolean;
    ariaLabel: string;
  }> = ({ label, onClick, disabled, ariaLabel }) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded text-sm font-bold transition-colors"
      >
        {label}
      </button>
    );
  };

const IntervalAdjustButtons: React.FC<{
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
}> = ({ value, onChange, min, max }) => {

  return (
    <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-0.5">
      <IntervalAdjustButton
        label="-12"
        onClick={() => onChange(Math.max(min, value - 12))}
        disabled={value <= min}
        ariaLabel={`Decrease interval by 12 semitones`}
      />
      <IntervalAdjustButton
        label="-1"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        ariaLabel={`Decrease interval by 1 semitone`}
      />
      <IntervalAdjustButton
        label="+1"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        ariaLabel={`Increase interval by 1 semitone`}
      />
      <IntervalAdjustButton
        label="+12"
        onClick={() => onChange(Math.min(max, value + 12))}
        disabled={value >= max}
        ariaLabel={`Increase interval by 12 semitones`}
      />
    </div>
  );
};

const ToneCard: React.FC<{
  id: string;
  name: string;
  volume: number;
  harmonicInterval: number;
  timeType: TimeType;
  updateVolume: (noteId: string, newVolume: number) => void;
  updateHarmonicInterval: (noteId: string, interval: number) => void;
  updateNoteType: (noteId: string, noteType: TimeType) => void;
}> = ({
  id,
  name,
  volume,
  harmonicInterval,
  timeType,
  updateVolume,
  updateHarmonicInterval,
  updateNoteType,
}) => (
  <div className="bg-white border rounded-lg p-3 flex flex-col w-full">
    <div className="font-semibold text-base mb-0.5">{name}</div>
    <HandToggle id={id} timeType={timeType} updateNoteType={updateNoteType} />
    {/* 3. Volume label & 4. Volume slider */}
    <LabeledSlider
      label="Volume:"
      value={volume}
      min={0}
      max={1}
      step={0.01}
      onChange={(val) => updateVolume(id, val)}
      valueDisplay={
        <span className="text-xs min-w-[1.5rem] text-right">
          {Math.round(volume * 100)}%
        </span>
      }
      colorClass="accent-red-500"
      ariaLabel={`Volume for ${name}`}
    />
    {/* 5. Interval label & 6. Interval slider */}
    <LabeledSlider
      label="Interval:"
      value={harmonicInterval}
      min={-24}
      max={24}
      step={1}
      onChange={(val) => updateHarmonicInterval(id, val)}
      valueDisplay={
        <span className="text-xs min-w-[1.5rem] text-right">
          {harmonicInterval > 0 ? `+${harmonicInterval}` : harmonicInterval} st
        </span>
      }
      colorClass="accent-blue-500"
      ariaLabel={`Interval for ${name}`}
    />
    {/* Interval adjust buttons */}
    <IntervalAdjustButtons
      value={harmonicInterval}
      onChange={(val) => updateHarmonicInterval(id, val)}
      min={-24}
      max={24}
    />
  </div>
);

const AudioOptions: React.FC<AudioOptionsProps> = ({
  notes,
  updateVolume,
  updateHarmonicInterval,
  updateNoteType,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full text-left whitespace-nowrap">
      <div className="grid grid-cols-2 gap-2 pl-2 w-full">
        {notes.map((note) => (
          <ToneCard
            key={note.id}
            {...note}
            updateVolume={updateVolume}
            updateHarmonicInterval={updateHarmonicInterval}
            updateNoteType={updateNoteType}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioOptions;
