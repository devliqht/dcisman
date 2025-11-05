import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${className}`}>
      {children}
    </div>
  );
};
