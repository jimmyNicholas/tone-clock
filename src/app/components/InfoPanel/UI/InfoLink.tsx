import React from "react";

interface InfoLinkProps {
  href: string;
  children: React.ReactNode;
}

const InfoLink: React.FC<InfoLinkProps> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline"
    title={href}
  >
    {children}
  </a>
);

export default InfoLink;
