import React from 'react';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message: string;
  showAuthButtons?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  showAuthButtons = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center min-h-[400px] px-4'>
      <div className='text-center max-w-lg'>
        <h2 className='text-pacman-yellow font-family-arcade text-3xl drop-shadow-lg mb-4'>
          {title}
        </h2>

        <h3 className='text-gray-400 font-family-vt323 text-md mb-8'>
          {message}
        </h3>

        {showAuthButtons && (
          <div className='flex gap-4 justify-center'>
            <Button
              onClick={() => navigate('/register')}
              className='bg-pacman-yellow hover:bg-yellow-400 text-black font-family-arcade text-lg px-6 py-3 transition-all duration-200'
            >
              Sign Up
            </Button>
            <Button
              onClick={() => navigate('/login')}
              className='bg-transparent border-2 border-pacman-yellow text-pacman-yellow hover:bg-pacman-yellow hover:text-black font-family-arcade text-lg px-6 py-3 transition-all duration-200'
            >
              Log In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
