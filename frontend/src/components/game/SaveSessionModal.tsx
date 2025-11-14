import React from 'react';
import { Card, Button } from '@/components/ui';

export interface GuestSessionData {
  score: number;
  levelReached: number;
  durationSeconds: number;
  ghostsEaten: number;
  powerUpsUsed: number;
  timestamp: number;
}

interface SaveSessionModalProps {
  session: GuestSessionData;
  onSave: () => void;
  onSkip: () => void;
}

export const SaveSessionModal: React.FC<SaveSessionModalProps> = ({
  session,
  onSave,
  onSkip,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50'>
      <Card className='bg-pacman-dark border-4 border-pacman-yellow p-8 max-w-lg w-full mx-4'>
        <div className='text-center mb-6'>
          <h2 className='text-pacman-yellow font-family-arcade text-4xl drop-shadow-lg mb-2'>
            Save Your Game?
          </h2>
          <p className='text-gray-400 font-family-vt323 text-lg'>
            Your game session will be saved to your account
          </p>
        </div>

        <div className='bg-maze-wall/50 rounded-lg p-4 border-2 border-maze-blue mb-6'>
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

        <div className='space-y-3'>
          <Button
            onClick={onSave}
            className='w-full bg-pacman-yellow hover:bg-yellow-400 text-black font-family-arcade text-xl py-3 transition-all duration-200 hover:scale-105'
          >
            Save This Game
          </Button>
          <Button
            onClick={onSkip}
            className='w-full bg-transparent border-2 border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white font-family-arcade text-xl py-3 transition-all duration-200'
          >
            Skip
          </Button>
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
      <p className={`font-family-arcade text-2xl ${valueColor} drop-shadow-lg`}>
        {value}
      </p>
    </div>
  );
};
