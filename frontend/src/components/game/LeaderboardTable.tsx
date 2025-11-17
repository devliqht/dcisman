import React from 'react';
import { type LeaderboardEntry } from '@/services/leaderboardService';
import { getRankColor, getRankIcon } from '@/utils/leaderboards.tsx';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  color: string;
  currentUserId?: number;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  color,
  currentUserId,
}) => {
  return (
    <div className='bg-pacman-dark/50 border-2 border-maze-blue rounded-lg overflow-hidden'>
      {entries.length === 0 ? (
        <div className='p-12 text-center'>
          <p className='text-gray-400 font-family-vt323 text-2xl'>
            No entries yet. Be the first to play!
          </p>
        </div>
      ) : (
        <>
          <div className='bg-maze-wall/50 border-b-2 border-maze-blue'>
            <div className='grid grid-cols-12 gap-4 px-6 py-4'>
              <div className='col-span-2 text-center'>
                <span className='text-gray-300 font-family-arcade text-lg'>
                  Rank
                </span>
              </div>
              <div className='col-span-6'>
                <span className='text-gray-300 font-family-arcade text-lg'>
                  Player
                </span>
              </div>
              <div className='col-span-4 text-right'>
                <span className={`${color} font-family-arcade text-lg`}>
                  Score
                </span>
              </div>
            </div>
          </div>

          <div className='divide-y divide-maze-blue/30'>
            {entries.map((entry) => {
              const isCurrentUser = currentUserId && entry.userId === currentUserId;
              return (
                <div
                  key={entry.userId}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-maze-wall/30 transition-colors ${
                    entry.rank <= 3 ? 'bg-maze-wall/20' : ''
                  } ${
                    isCurrentUser ? 'bg-pacman-yellow-light/20' : ''
                  }`}
                >
                  <div className='col-span-2 flex items-center justify-center'>
                    {typeof getRankIcon(entry.rank) === 'string' ? (
                      <span
                        className={`font-family-arcade text-2xl ${getRankColor(
                          entry.rank
                        )}`}
                      >
                        {getRankIcon(entry.rank)}
                      </span>
                    ) : (
                      <span className={getRankColor(entry.rank)}>
                        {getRankIcon(entry.rank)}
                      </span>
                    )}
                  </div>
                  <div className='col-span-6 flex flex-col justify-center'>
                    <h5 className={`font-family-vt323 text-xl truncate ${
                      isCurrentUser ? 'text-pacman-yellow' : 'text-white'
                    }`}>
                      {entry.username}
                    </h5>
                    {(entry.name || entry.idNumber) && (
                      <span className='text-gray-400 font-family-vt323 text-2xl truncate'>
                        {entry.name && <span>{entry.name}</span>}
                        {entry.name && entry.idNumber && <span> - </span>}
                        {entry.idNumber && <span>{entry.idNumber}</span>}
                      </span>
                    )}
                  </div>
                  <div className='col-span-4 flex items-center justify-end'>
                    <span className={`${color} font-family-arcade text-2xl`}>
                      {entry.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
