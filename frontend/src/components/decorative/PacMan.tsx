import React from 'react';

interface PacManProps {
  className?: string;
}

export const PacMan: React.FC<PacManProps> = ({ className = '' }) => {
  return <div className={`pacman ${className}`}></div>;
};
