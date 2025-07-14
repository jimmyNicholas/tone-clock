import { noteLabels } from "@/app/lib"

type ClockFaceProps = {
    hours: number | null,
    minutes: number | null,
    seconds: number | null,
}

export const getHandAngle = (value: number, max: number): number => {
  return (value / max) * 360 - 90;
};

const ClockFace = ({hours, minutes, seconds}: ClockFaceProps) => {
  if (hours == null || minutes == null || seconds == null) return null;
  const hourAngle = getHandAngle(hours + minutes / 60 + seconds / 3600, 12);
  const minuteAngle = getHandAngle(minutes + seconds / 60, 60);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <svg width="400" height="400" className="drop-shadow-xl">
        {/* Outer circle background */}
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* Inner circle */}
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="1"
        />

        {/* Note positions and labels */}
        {noteLabels.map((note, index) => {
          const angle = index * 30 - 90;
          const radian = (angle * Math.PI) / 180;
          const x = 200 + 155 * Math.cos(radian);
          const y = 200 + 155 * Math.sin(radian);

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="20"
                fill="#10b981"
                className="opacity-70"
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                className="text-xs font-semibold fill-white"
              >
                {note}
              </text>
            </g>
          );
        })}

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = i * 30 - 90;
          const radian = (angle * Math.PI) / 180;
          const x1 = 200 + 110 * Math.cos(radian);
          const y1 = 200 + 110 * Math.sin(radian);
          const x2 = 200 + 100 * Math.cos(radian);
          const y2 = 200 + 100 * Math.sin(radian);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#6b7280"
              strokeWidth="2"
            />
          );
        })}

        {/* Center dot */}
        <circle cx="200" cy="200" r="8" fill="#1f2937" />

        {/* Hour hand */}
        <line
          x1="200"
          y1="200"
          x2={200 + 60 * Math.cos((hourAngle * Math.PI) / 180)}
          y2={200 + 60 * Math.sin((hourAngle * Math.PI) / 180)}
          stroke="#dc2626"
          strokeWidth="6"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />

        {/* Minute hand */}
        <line
          x1="200"
          y1="200"
          x2={200 + 85 * Math.cos((minuteAngle * Math.PI) / 180)}
          y2={200 + 85 * Math.sin((minuteAngle * Math.PI) / 180)}
          stroke="#059669"
          strokeWidth="4"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};

export default ClockFace;
