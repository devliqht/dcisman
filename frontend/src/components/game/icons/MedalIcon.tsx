import React from 'react';

interface MedalIconProps {
  variant?: 'gold' | 'silver' | 'bronze';
}

export const MedalIcon: React.FC<MedalIconProps> = ({ variant = 'gold' }) => {
  const getColor = () => {
    switch (variant) {
      case 'gold':
        return '#fbbf24'; // yellow-400
      case 'silver':
        return '#d1d5db'; // gray-300
      case 'bronze':
        return '#fb923c'; // orange-400
      default:
        return '#fbbf24';
    }
  };

  return (
    <svg
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='pixelated'
    >
      {/* left ribbon */}
      <rect x='10' y='4' width='4' height='8' fill={getColor()} />
      <rect x='10' y='12' width='2' height='4' fill={getColor()} />

      {/* right ribbon */}
      <rect x='18' y='4' width='4' height='8' fill={getColor()} />
      <rect x='20' y='12' width='2' height='4' fill={getColor()} />

      {/* medal circle outer */}
      <rect x='10' y='12' width='12' height='2' fill={getColor()} />
      <rect x='8' y='14' width='2' height='10' fill={getColor()} />
      <rect x='22' y='14' width='2' height='10' fill={getColor()} />
      <rect x='10' y='24' width='12' height='2' fill={getColor()} />

      {/* medal circle inner ring */}
      <rect
        x='10'
        y='14'
        width='12'
        height='2'
        fill={getColor()}
        opacity='0.7'
      />
      <rect
        x='10'
        y='16'
        width='2'
        height='6'
        fill={getColor()}
        opacity='0.7'
      />
      <rect
        x='20'
        y='16'
        width='2'
        height='6'
        fill={getColor()}
        opacity='0.7'
      />
      <rect
        x='10'
        y='22'
        width='12'
        height='2'
        fill={getColor()}
        opacity='0.7'
      />

      {/* center detail - "1" or star shape */}
      <rect
        x='14'
        y='16'
        width='4'
        height='2'
        fill={getColor()}
        opacity='0.9'
      />
      <rect
        x='15'
        y='18'
        width='2'
        height='4'
        fill={getColor()}
        opacity='0.9'
      />
    </svg>
  );
};
