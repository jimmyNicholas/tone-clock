import React from "react";
import { noteLabels } from "@/utils/lib"

type ClockFaceProps = {
    hours: number | null,
    minutes: number | null,
    seconds: number | null,
    size: number,
}

export const getHandAngle = (value: number, max: number): number => {
  return (value / max) * 360 - 90;
};

const ClockFace: React.FC<ClockFaceProps> = ({hours, minutes, seconds, size}) => {
  if (hours == null || minutes == null || seconds == null) return null;
  const hourAngle = getHandAngle(hours + minutes / 60 + seconds / 3600, 12);
  const minuteAngle = getHandAngle(minutes + seconds / 60, 60);

  const center = size / 2;
  const outerRadius = size * 0.475; // 190/400
  const innerRadius = size * 0.3;   // 120/400
  const noteRadius = size * 0.3875; // 155/400
  const noteCircleRadius = size * 0.05; // 20/400
  const hourMarkerOuter = size * 0.275; // 110/400
  const hourMarkerInner = size * 0.25;  // 100/400
  const hourHandLength = size * 0.15;   // 60/400
  const minuteHandLength = size * 0.2125; // 85/400
  const centerDotRadius = size * 0.02;  // 8/400
  
  // Scale stroke widths proportionally
  const outerStrokeWidth = size * 0.005; // 2/400
  const innerStrokeWidth = size * 0.0025; // 1/400
  const markerStrokeWidth = size * 0.005; // 2/400
  const hourHandStroke = size * 0.015;   // 6/400
  const minuteHandStroke = size * 0.01;  // 4/400

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <svg width={size} height={size} className="drop-shadow-xl">
        {/* Outer circle background */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="white"
          stroke="#e5e7eb"
          strokeWidth={outerStrokeWidth}
        />
        
        {/* Inner circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth={innerStrokeWidth}
        />
        
        {/* Note positions and labels */}
        {noteLabels.map((note, index) => {
          const angle = index * 30 - 90;
          const radian = (angle * Math.PI) / 180;
          const x = center + noteRadius * Math.cos(radian);
          const y = center + noteRadius * Math.sin(radian);
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r={noteCircleRadius}
                fill="#10b981"
                className="opacity-70"
              />
              <text
                x={x}
                y={y + noteCircleRadius * 0.25} // Adjust text position proportionally
                textAnchor="middle"
                className="font-semibold fill-white"
                fontSize={size * 0.03} // Scale font size proportionally
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
          const x1 = center + hourMarkerOuter * Math.cos(radian);
          const y1 = center + hourMarkerOuter * Math.sin(radian);
          const x2 = center + hourMarkerInner * Math.cos(radian);
          const y2 = center + hourMarkerInner * Math.sin(radian);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#6b7280"
              strokeWidth={markerStrokeWidth}
            />
          );
        })}
        
        {/* Center dot */}
        <circle cx={center} cy={center} r={centerDotRadius} fill="#1f2937" />
        
        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={center + hourHandLength * Math.cos((hourAngle * Math.PI) / 180)}
          y2={center + hourHandLength * Math.sin((hourAngle * Math.PI) / 180)}
          stroke="#dc2626"
          strokeWidth={hourHandStroke}
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
        
        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={center + minuteHandLength * Math.cos((minuteAngle * Math.PI) / 180)}
          y2={center + minuteHandLength * Math.sin((minuteAngle * Math.PI) / 180)}
          stroke="#059669"
          strokeWidth={minuteHandStroke}
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};


export default ClockFace;
