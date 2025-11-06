import React from 'react';
import { MedalIcon } from '@/components/game/icons';

export const getRankColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return 'text-yellow-400';
    case 2:
      return 'text-gray-300';
    case 3:
      return 'text-orange-400';
    default:
      return 'text-white';
  }
};

export const getRankIcon = (rank: number): React.ReactNode => {
  switch (rank) {
    case 1:
      return <MedalIcon variant='gold' />;
    case 2:
      return <MedalIcon variant='silver' />;
    case 3:
      return <MedalIcon variant='bronze' />;
    default:
      return `${rank}.`;
  }
};

type TabType = 'HIGH_SCORE' | 'HIGHEST_LEVEL' | 'TOTAL_GHOSTS';

export const getTabConfig = (tab: TabType) => {
  switch (tab) {
    case 'HIGH_SCORE':
      return {
        title: 'Highest Scores',
        color: 'text-pacman-yellow',
        borderColor: 'border-pacman-yellow',
        bgColor: 'bg-pacman-yellow/10',
      };
    case 'HIGHEST_LEVEL':
      return {
        title: 'Highest Levels',
        color: 'text-ghost-cyan',
        borderColor: 'border-ghost-cyan',
        bgColor: 'bg-ghost-cyan/10',
      };
    case 'TOTAL_GHOSTS':
      return {
        title: 'Most Ghosts Eaten',
        color: 'text-ghost-red',
        borderColor: 'border-ghost-red',
        bgColor: 'bg-ghost-red/10',
      };
  }
};
