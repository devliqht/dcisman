import React from 'react';

interface StatBoxProps {
  label: string;
  value: string;
  color?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({
  label,
  value,
  color = 'text-white',
}) => {
  return (
    <div className='text-center'>
      <p className='text-gray-500 font-family-vt323 text-xl uppercase mb-1'>
        {label}
      </p>
      <p className={`font-family-arcade text-xl ${color}`}>{value}</p>
    </div>
  );
};
