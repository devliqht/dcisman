import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'px-6 py-3 rounded-lg font-family-arcade text-sm transform transition-all duration-200 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer';

  const variantStyles = {
    primary:
      'bg-pacman-yellow text-black hover:bg-pacman-yellow-light hover:scale-102',
    secondary: 'bg-maze-blue text-white hover:bg-ghost-cyan hover:text-black',
    danger: 'bg-ghost-red text-white hover:bg-ghost-red-light',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
