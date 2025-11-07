import React from 'react';
import { StatsIcon, LogoutIcon } from './icons';
import { type UserStats } from '@/services/statsService';

interface UserCardProps {
  username: string;
  userStats: UserStats | null;
  onViewProfile: () => void;
  onLogout: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  username,
  userStats,
  onViewProfile,
  onLogout,
}) => {
  return (
    <div className='fixed top-0 left-0 bg-pacman-dark/90 border-2 border-pacman-yellow rounded-lg p-4 shadow-lg backdrop-blur-sm z-50 m-2'>
      <div className='flex items-start gap-4'>
        <div className='flex-1'>
          <h3 className='font-family-arcade text-xl text-pacman-yellow mb-2'>
            {username}
          </h3>
          {userStats ? (
            <div className='space-y-1'>
              <p className='font-family-vt323 text-lg text-gray-300'>
                High Score:{' '}
                <span className='text-pacman-yellow'>
                  {userStats.highestScore.toLocaleString()}
                </span>
              </p>
              <p className='font-family-vt323 text-lg text-gray-300'>
                Best Level:{' '}
                <span className='text-pacman-yellow'>
                  {userStats.highestLevelReached}
                </span>
              </p>
            </div>
          ) : (
            <p className='font-family-vt323 text-lg text-gray-400'>
              Loading...
            </p>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <button
            onClick={onViewProfile}
            className='p-2 border-2 border-pacman-yellow text-pacman-yellow hover:bg-pacman-yellow hover:text-pacman-dark rounded transition-all duration-200 [&_svg]:w-6! [&_svg]:h-6! [&_svg]:m-0! [&:hover_svg]:text-black'
            title='View Profile'
          >
            <StatsIcon />
          </button>
          <button
            onClick={onLogout}
            className='p-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-all duration-200 [&_svg]:w-6! [&_svg]:h-6! [&_svg]:m-0!'
            title='Logout'
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
