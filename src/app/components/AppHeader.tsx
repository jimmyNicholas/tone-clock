import React from "react";

const AppHeader: React.FC = () => {
  return (
    <header className="text-center mb-4">
      <h1 className="text-4xl font-bold text-on-surface mb-2">Tone Clock</h1>
      <p className="text-on-surface/70 mb-2 font-handwriting font-bold text-lg">~ Listen to the time ~</p>
    </header>
  );
};

export default AppHeader;