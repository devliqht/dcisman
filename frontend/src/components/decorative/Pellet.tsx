import React from 'react';

interface PelletProps {
  isPowerPellet?: boolean;
  className?: string;
}

export const Pellet: React.FC<PelletProps> = ({
  isPowerPellet = false,
  className = '',
}) => {
  return (
    <div
      className={`${isPowerPellet ? 'power-pellet' : 'pellet'} ${className}`}
    ></div>
  );
};
