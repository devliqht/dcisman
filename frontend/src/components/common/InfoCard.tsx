import React from 'react';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon, title, children }) => {
  return (
    <div className='bg-pacman-dark/50 p-4 rounded-lg text-center'>
      {icon}
      <h3 className='text-pacman-yellow font-family-vt323 text-base mb-2'>
        {title}
      </h3>
      {children}
    </div>
  );
};
