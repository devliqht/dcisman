import React from 'react';
import { type GameSessionData } from '@/services/gameSessionService';
import { formatTime, formatDate, getStatusColor } from '@/utils/gameSession';
import { StatBox } from '@/components/common/StatBox';

interface GameSessionCardProps {
  session: GameSessionData;
}

export const GameSessionCard: React.FC<GameSessionCardProps> = ({ session }) => {
  return (
    <div className='bg-pacman-dark rounded-lg p-4 border-2 border-maze-blue hover:border-pacman-yellow transition-all duration-200'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <span className='text-gray-500 font-family-vt323 text-4xl'>
            #{session.id}
          </span>
          <span className='text-gray-400 font-family-vt323 text-xl'>
            {formatDate(session.startedAt)}
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-full border font-family-vt323 text-sm uppercase ${getStatusColor(
            session.status
          )}`}
        >
          {session.status}
        </span>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        <StatBox
          label='Score'
          value={session.score.toLocaleString()}
          color='text-pacman-yellow'
        />
        <StatBox
          label='Level'
          value={session.levelReached.toString()}
          color='text-ghost-cyan'
        />
        <StatBox
          label='Time'
          value={formatTime(session.durationSeconds)}
          color='text-ghost-pink'
        />
        <StatBox
          label='Ghosts'
          value={session.ghostsEaten.toString()}
          color='text-ghost-orange'
        />
        <StatBox
          label='Power-ups'
          value={session.powerUpsUsed.toString()}
          color='text-white'
        />
      </div>
    </div>
  );
};
