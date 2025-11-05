import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import {
  TrophyIcon,
  TargetIcon,
  GhostEatenIcon,
  MedalIcon,
} from '@/components/game/icons';
import {
  createLeaderboardPoller,
  type LeaderboardResponse,
  type LeaderboardEntry,
} from '@/services/leaderboardService';

type TabType = 'HIGH_SCORE' | 'HIGHEST_LEVEL' | 'TOTAL_GHOSTS';

export const Leaderboards: React.FC = () => {
  const navigate = useNavigate();
  const [leaderboards, setLeaderboards] = useState<LeaderboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('HIGH_SCORE');

  useEffect(() => {
    const cleanup = createLeaderboardPoller(
      data => {
        setLeaderboards(data);
        setLastUpdated(new Date());
        setLoading(false);
      },
      10,
      60000 
    );

    return cleanup;
  }, []);

  const getTabConfig = (tab: TabType) => {
    switch (tab) {
      case 'HIGH_SCORE':
        return {
          title: 'Highest Scores',
          icon: <TrophyIcon />,
          color: 'text-pacman-yellow',
          borderColor: 'border-pacman-yellow',
          bgColor: 'bg-pacman-yellow/10',
        };
      case 'HIGHEST_LEVEL':
        return {
          title: 'Highest Levels',
          icon: <TargetIcon />,
          color: 'text-ghost-cyan',
          borderColor: 'border-ghost-cyan',
          bgColor: 'bg-ghost-cyan/10',
        };
      case 'TOTAL_GHOSTS':
        return {
          title: 'Most Ghosts Eaten',
          icon: <GhostEatenIcon />,
          color: 'text-ghost-red',
          borderColor: 'border-ghost-red',
          bgColor: 'bg-ghost-red/10',
        };
    }
  };

  const getRankColor = (rank: number): string => {
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

  const getRankIcon = (rank: number): React.ReactNode => {
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

  const activeLeaderboard = leaderboards.find(lb => lb.category === activeTab);
  const activeConfig = getTabConfig(activeTab);

  return (
    <div className='min-h-screen bg-pacman-dark flex flex-col items-center justify-center p-6'>
      <Card className='w-full max-w-4xl bg-maze-wall/90'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-4xl font-family-arcade text-pacman-yellow mb-2'>
              Leaderboards
            </h1>
            {lastUpdated && (
              <p className='text-gray-400 font-family-vt323 text-lg'>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            onClick={() => navigate('/')}
            variant='secondary'
            className='font-family-vt323 text-2xl!'
          >
            Back to Game
          </Button>
        </div>

        {loading && (
          <div className='text-center py-12'>
            <p className='text-white font-family-vt323 text-3xl'>
              Loading leaderboards...
            </p>
          </div>
        )}

        {!loading && leaderboards.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-400 font-family-vt323 text-2xl'>
              No leaderboard data available yet. Play some games to get started!
            </p>
          </div>
        )}

        {!loading && leaderboards.length > 0 && (
          <>
            <div className='flex gap-2 mb-4 pb-2'>
              {(
                ['HIGH_SCORE', 'HIGHEST_LEVEL', 'TOTAL_GHOSTS'] as TabType[]
              ).map(tab => {
                const config = getTabConfig(tab);
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 p-0 rounded-lg font-family-vt323 text-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                      isActive
                        ? `${config.color} ${config.bgColor} border-2 ${config.borderColor}`
                        : 'text-gray-400 hover:text-white hover:bg-maze-wall/30 border-2 border-transparent'
                    }`}
                  >
                    <span className='inline-flex items-center'>
                      {config.icon}
                    </span>
                    {config.title}
                  </button>
                );
              })}
            </div>

            {/* Leaderboard Table */}
            {activeLeaderboard && (
              <LeaderboardTable
                entries={activeLeaderboard.entries}
                totalPlayers={activeLeaderboard.totalPlayers}
                color={activeConfig.color}
                getRankColor={getRankColor}
                getRankIcon={getRankIcon}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  totalPlayers: number;
  color: string;
  getRankColor: (rank: number) => string;
  getRankIcon: (rank: number) => React.ReactNode;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  totalPlayers,
  color,
  getRankColor,
  getRankIcon,
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
            {entries.map((entry, index) => (
              <div
                key={entry.userId}
                className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-maze-wall/30 transition-colors ${
                  index < 3 ? 'bg-maze-wall/20' : ''
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
                <div className='col-span-6 flex items-center'>
                  <span className='text-white font-family-vt323 text-2xl truncate'>
                    {entry.username}
                  </span>
                </div>
                <div className='col-span-4 flex items-center justify-end'>
                  <span className={`${color} font-family-arcade text-2xl`}>
                    {entry.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-maze-wall/50 border-t-2 border-maze-blue px-6 py-4'>
            <p className='text-gray-400 font-family-vt323 text-xl text-center'>
              Total Players: <span className='text-white'>{totalPlayers}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
