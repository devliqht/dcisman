import React from 'react';
import { Card, Button } from '@/components/ui';
import { HomeIcon, ClockIcon, TrophyIcon } from './icons';
import type { GameSessionData } from '@/services/gameSessionService';

interface GameOverModalProps {
  session: GameSessionData | null;
  onPlayAgain: () => void;
  onHome: () => void;
  onViewRecentGames: () => void;
  onViewLeaderboards: () => void;
  onLogout: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  session,
  onPlayAgain,
  onHome,
  onViewRecentGames,
  onViewLeaderboards,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='absolute inset-0 flex items-center justify-center bg-black backdrop-blur-sm z-50'>
      <Card className='bg-pacman-dark border-4 border-ghost-red p-8 max-w-lg w-full mx-4'>
        <div className='text-center mb-8'>
          <h1 className='text-ghost-red font-family-arcade text-5xl drop-shadow-lg mb-2'>
            Game Over
          </h1>
          <h3 className='text-gray-400 font-family-vt323 text-base'>
            Better luck next time!
          </h3>
        </div>

        {/* session stats */}
        {session && (
          <div className='space-y-4 mb-8'>
            <div className='bg-maze-wall/50 rounded-lg p-4 border-2 border-maze-blue'>
              <div className='grid grid-cols-2 gap-4'>
                <StatItem
                  label='Final Score'
                  value={session.score.toLocaleString()}
                  valueColor='text-pacman-yellow'
                />
                <StatItem
                  label='Level Reached'
                  value={session.levelReached.toString()}
                  valueColor='text-ghost-cyan'
                />
                <StatItem
                  label='Time Played'
                  value={formatTime(session.durationSeconds)}
                  valueColor='text-ghost-pink'
                />
                <StatItem
                  label='Ghosts Eaten'
                  value={session.ghostsEaten.toString()}
                  valueColor='text-ghost-orange'
                />
              </div>
            </div>

            {session.powerUpsUsed > 0 && (
              <div className='text-center'>
                <p className='text-gray-400 font-family-vt323 text-lg'>
                  Power-ups used:{' '}
                  <span className='text-white font-bold'>
                    {session.powerUpsUsed}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* action buttons */}
        <div className='space-y-4'>
          <Button
            onClick={onPlayAgain}
            className='w-full bg-pacman-yellow hover:bg-yellow-400 text-black font-family-arcade text-2xl py-3 transition-all duration-200 hover:scale-105'
          >
            Play Again
          </Button>

          <div className='flex gap-3 justify-center'>
            <button
              onClick={onHome}
              className='border-2 border-pacman-yellow text-pacman-yellow hover:bg-pacman-yellow hover:text-pacman-dark font-family-arcade w-14 h-14 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center [&:hover_svg]:text-black'
              title='Home'
            >
              <HomeIcon />
            </button>
            <button
              onClick={onViewRecentGames}
              className='border-2 border-pacman-yellow text-pacman-yellow hover:bg-pacman-yellow hover:text-black font-family-arcade w-14 h-14 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center [&:hover_svg]:text-black'
              title='Recent Games'
            >
              <ClockIcon />
            </button>
            <button
              onClick={onViewLeaderboards}
              className='border-2 border-pacman-yellow text-pacman-yellow hover:bg-pacman-yellow hover:text-black font-family-arcade w-14 h-14 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center [&:hover_svg]:text-black'
              title='Leaderboards'
            >
              <TrophyIcon />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: string;
  valueColor?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  valueColor = 'text-white',
}) => {
  return (
    <div className='text-center'>
      <p className='text-gray-400 font-family-vt323 text-sm uppercase tracking-wide mb-1'>
        {label}
      </p>
      <p className={`font-family-arcade text-3xl ${valueColor} drop-shadow-lg`}>
        {value}
      </p>
    </div>
  );
};
