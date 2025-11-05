import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className='w-full'>
      {label && (
        <label className="block text-white font-['Press_Start_2P'] text-xs mb-2">
          {label}
        </label>
      )}
      <input
        className={`bg-maze-blue-dark text-white border-2 ${
          error ? 'border-ghost-red' : 'border-maze-blue'
        } px-4 py-3 rounded-lg focus:outline-none focus:border-pacman-yellow focus:ring-2 focus:ring-pacman-yellow transition-all duration-200 font-family-vt323 text-2xl w-full focus:text-pacman-yellow ${className}`}
        {...props}
      />
      {error && (
        <p className="text-ghost-red font-['VT323'] text-xl mt-1">{error}</p>
      )}
    </div>
  );
};
