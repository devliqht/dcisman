import React from 'react';

interface GhostProps {
  color?: string;
  className?: string;
  delay?: string;
}

export const Ghost: React.FC<GhostProps> = ({
  color = 'var(--color-ghost-red)',
  className = '',
  delay = '0s',
}) => {
  return (
    <div
      className={`ghost ${className}`}
      style={{
        background: color,
        animationDelay: delay,
      }}
    ></div>
  );
};
