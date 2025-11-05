import React from 'react';

interface GameStatProps {
  label: string;
  value: string | number;
  id: string;
  valueClassName: string;
}

export const GameStat: React.FC<GameStatProps> = ({
  label,
  value,
  id,
  valueClassName,
}) => {
  return (
    <div className='bg-pacman-dark/50 p-6 rounded-lg text-center'>
      <p className='text-gray-400 font-family-vt323 text-lg mb-2'>{label}</p>
      <p id={id} className={`font-family-arcade text-3xl ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
};
