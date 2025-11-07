import React from 'react';
import { GamesIcon, TrophyIcon } from './icons';

interface NavigationButtonsProps {
  onViewRecentGames: () => void;
  onViewLeaderboards: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onViewRecentGames,
  onViewLeaderboards,
}) => {
  return (
    <div className='flex gap-4 mt-6'>
      <button
        onClick={onViewRecentGames}
        className='flex flex-col items-center gap-2 px-6 py-4 bg-pacman-dark/90 border-2 border-pacman-yellow rounded-lg hover:bg-pacman-yellow/10 transition-all duration-200 hover:cursor-pointer [&_svg]:!w-12 [&_svg]:!h-12 text-pacman-yellow'
      >
        <GamesIcon />
        <span className='font-family-vt323 text-xl text-pacman-yellow'>
          Recent Games
        </span>
      </button>

      <button
        onClick={onViewLeaderboards}
        className='flex flex-col items-center gap-2 px-6 py-4 bg-pacman-dark/90 border-2 border-pacman-yellow rounded-lg hover:bg-pacman-yellow/10 transition-all duration-200 hover:cursor-pointer [&_svg]:!w-12 [&_svg]:!h-12 text-pacman-yellow'
      >
        <TrophyIcon />
        <span className='font-family-vt323 text-xl text-pacman-yellow'>
          Leaderboards
        </span>
      </button>
    </div>
  );
};
