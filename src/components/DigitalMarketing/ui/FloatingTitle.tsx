import React from "react";

interface Props {
  subtitle?: string;
  title: string;
}

const FloatingTitle: React.FC<Props> = ({ subtitle, title }) => {
  return (
    <div className="mb-8">
      {subtitle && <p className="agency-about-eyebrow mb-3">{subtitle}</p>}
      <h2 className="section-title">{title}</h2>
    </div>
  );
};

export default FloatingTitle;
