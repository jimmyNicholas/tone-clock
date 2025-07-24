import React from "react";

const InfoParagraph: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={`text-left text-sm mb-2 ${className ?? ""}`}>{children}</p>
);

export default InfoParagraph;
