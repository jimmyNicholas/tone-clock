import React from "react";

const InfoHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="font-bold text-xl mb-2 text-center">{children}</h2>
);

export default InfoHeader;
