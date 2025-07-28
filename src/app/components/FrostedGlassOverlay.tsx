import React from "react";

interface FrostedGlassOverlayProps {
  isEnabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FrostedGlassOverlay: React.FC<FrostedGlassOverlayProps> = ({
  isEnabled,
  onToggle,
  children,
}) => {
  return (
    <button
      className={`relative`}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-label="Click to enable sound"
      aria-pressed={isEnabled}
    >
      {children}

      {/* Frosted Glass Overlay - shows when audio is enabled to allow disabling */}
      {!isEnabled && (
        <div
          className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/30 opacity-100"
          tabIndex={0}
          
        >
          <div className="text-center p-6 bg-white/80 rounded-lg shadow-lg backdrop-blur-md">
            <div className="text-2xl mb-2">🔊</div>
            <div className="text-gray-700 font-medium">Sound Disabled</div>
            <div className="text-sm text-gray-500 mt-1">Click to enable</div>
          </div>
        </div>
      )}
    </button>
  );
};

export default FrostedGlassOverlay;
