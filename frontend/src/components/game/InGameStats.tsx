import React from 'react';
import { GameStat } from './GameStat';

interface InGameStatsProps {
  highScore: number;
}

export const InGameStats: React.FC<InGameStatsProps> = ({ highScore }) => {
  return (
    <div className='flex flex-col gap-6 min-w-[200px]'>
      <GameStat
        label='Score'
        value='0'
        id='game-score'
        valueClassName='text-pacman-yellow'
      />
      <GameStat
        label='High Score'
        value={highScore.toLocaleString()}
        id='game-high-score'
        valueClassName='text-pacman-yellow/70'
      />
      <GameStat
        label='Level'
        value='1'
        id='game-level'
        valueClassName='text-ghost-cyan'
      />
      <GameStat
        label='Lives'
        value='3'
        id='game-lives'
        valueClassName='text-ghost-red'
      />
      <GameStat
        label='Time'
        value='0'
        id='game-time'
        valueClassName='text-ghost-pink'
      />
    </div>
  );
};
