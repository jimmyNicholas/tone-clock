import React from "react";

const InfoHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="font-semibold mb-2 text-center">{children}</h2>
);

export default InfoHeader;
