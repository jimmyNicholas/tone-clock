import React from "react";

const AppHeader: React.FC = () => {
  return (
    <header className="text-center mb-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Tone Clock</h1>
      <p className="text-gray-600 mb-2">~ Listen to the time ~</p>
    </header>
  );
};

export default AppHeader;