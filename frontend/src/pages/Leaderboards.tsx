import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import {
  TrophyIcon,
  TargetIcon,
  GhostEatenIcon,
  BackIcon,
} from '@/components/game/icons';
import {
  getAllLeaderboards,
  type LeaderboardResponse,
} from '@/services/leaderboardService';
import { useAuth } from '@/hooks/useAuth';
import { getTabConfig } from '@/utils/leaderboards.tsx';
import { LeaderboardTable } from '@/components/game/LeaderboardTable';
import { PaginationControls } from '@/components/common/PaginationControls';

type TabType = 'HIGH_SCORE' | 'HIGHEST_LEVEL' | 'TOTAL_GHOSTS';

export const Leaderboards: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [leaderboards, setLeaderboards] = useState<LeaderboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('HIGH_SCORE');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const fetchLeaderboards = useCallback(async () => {
    try {
      const data = await getAllLeaderboards(currentPage, pageSize);
      setLeaderboards(data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch leaderboards:', error);
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchLeaderboards();

    const intervalId = window.setInterval(fetchLeaderboards, 60000);

    return () => clearInterval(intervalId);
  }, [fetchLeaderboards]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    const activeLeaderboard = leaderboards.find(lb => lb.category === activeTab);
    if (activeLeaderboard && currentPage < activeLeaderboard.totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getTabIcon = (tab: TabType): React.ReactNode => {
    switch (tab) {
      case 'HIGH_SCORE':
        return <TrophyIcon />;
      case 'HIGHEST_LEVEL':
        return <TargetIcon />;
      case 'TOTAL_GHOSTS':
        return <GhostEatenIcon />;
    }
  };

  const activeLeaderboard = leaderboards.find(lb => lb.category === activeTab);
  const activeConfig = getTabConfig(activeTab);

  return (
    <div className='min-h-screen bg-pacman-dark flex flex-col items-center pt-10 p-6'>
      <Card className='w-full max-w-4xl bg-maze-wall/90'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h1 className='text-4xl font-family-arcade text-pacman-yellow mb-2'>
              Leaderboards
            </h1>
            {lastUpdated && (
              <h3 className='text-gray-400 font-family-vt323 text-sm'>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </h3>
            )}
          </div>
          <div className='flex items-center gap-4'>
            {!loading && activeLeaderboard && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={activeLeaderboard.totalPages}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
                onPageClick={handlePageClick}
              />
            )}
            <button
              onClick={() => navigate('/')}
              className='border-2 border-pacman-yellow text-pacman-yellow hover:bg-pacman-yellow hover:text-black font-family-arcade w-12 h-12 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center'
              title='Back to Game'
            >
              <BackIcon />
            </button>
          </div>
        </div>

        {/* Guest Banner */}
        {isGuest && (
          <div className='mb-6 bg-ghost-cyan/20 border-2 border-ghost-cyan rounded-lg p-4'>
            <h3 className='text-ghost-cyan font-family-vt323 text-lg text-center'>
              Sign in to compete on the leaderboards and track your rank!{' '}
              <button
                onClick={() => navigate('/register')}
                className='text-pacman-yellow underline hover:text-white transition-colors font-bold'
              >
                Sign Up
              </button>
            </h3>
          </div>
        )}

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
                    onClick={() => handleTabChange(tab)}
                    className={`flex-1 p-2 rounded-lg font-family-vt323 text-2xl transition-all duration-200 flex items-center justify-center hover:cursor-pointer gap-2 ${
                      isActive
                        ? `${config.color} ${config.bgColor} border-2 ${config.borderColor}`
                        : 'text-gray-400 hover:text-white hover:bg-maze-wall/30 border-2 border-transparent'
                    }`}
                  >
                    <span className='inline-flex items-center'>
                      {getTabIcon(tab)}
                    </span>
                    {config.title}
                  </button>
                );
              })}
            </div>

            {activeLeaderboard && (
              <LeaderboardTable
                entries={activeLeaderboard.entries}
                color={activeConfig.color}
                currentUserId={user?.id}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};
