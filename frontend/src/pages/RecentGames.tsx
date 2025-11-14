import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import {
  getUserSessions,
  type GameSessionData,
} from '@/services/gameSessionService';
import { useAuth } from '@/hooks/useAuth';
import { BackIcon } from '@/components/game/icons';
import { GameSessionCard } from '@/components/game/GameSessionCard';
import { PaginationControls } from '@/components/common/PaginationControls';
import { EmptyState } from '@/components/common/EmptyState';

type TabType = 'ALL' | 'COMPLETED' | 'ABANDONED';

export const RecentGames: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [sessions, setSessions] = useState<GameSessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    if (isGuest) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await getUserSessions();
        const sorted = data.sort(
          (a, b) =>
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        );
        setSessions(sorted);
      } catch (err) {
        console.error('failed to fetch sessions:', err);
        setError('Failed to load game history');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [isGuest]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const filteredSessions = useMemo(() => {
    if (activeTab === 'ALL') return sessions;
    return sessions.filter((session) => session.status === activeTab);
  }, [sessions, activeTab]);

  const paginatedSessions = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredSessions.slice(startIndex, startIndex + pageSize);
  }, [filteredSessions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredSessions.length / pageSize);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='min-h-screen bg-pacman-dark flex flex-col items-center pt-10 p-6'>
      <Card className='w-full max-w-5xl bg-maze-wall/90'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h1 className='text-4xl font-family-arcade text-pacman-yellow mb-2'>
              Recent Games
            </h1>
            <h3 className='text-gray-400 font-family-vt323 text-sm'>
              {user?.username}'s Game History
            </h3>
          </div>
          <div className='flex items-center gap-4'>
            {!loading && filteredSessions.length > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
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

        {loading && (
          <div className='text-center py-12'>
            <p className='text-white font-family-vt323 text-2xl'>
              Loading game history...
            </p>
          </div>
        )}

        {error && (
          <div className='text-center py-12'>
            <p className='text-ghost-red font-family-vt323 text-2xl mb-4'>
              {error}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant='secondary'
              className='font-family-vt323 text-xl'
            >
              Retry
            </Button>
          </div>
        )}

        {isGuest && !loading && (
          <EmptyState
            title='No Game History'
            message='Sign in to save your game history'
            showAuthButtons={true}
          />
        )}

        {!loading && !error && !isGuest && sessions.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-400 font-family-vt323 text-2xl mb-4'>
              No games played yet
            </p>
            <p className='text-gray-500 font-family-vt323 text-lg'>
              Start playing to see your game history!
            </p>
          </div>
        )}

        {!loading && !error && !isGuest && sessions.length > 0 && (
          <>
            <div className='flex gap-2 mb-4 pb-2'>
              {(['ALL', 'COMPLETED', 'ABANDONED'] as TabType[]).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`flex-1 p-3 rounded-lg font-family-arcade text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-pacman-yellow text-black border-2 border-pacman-yellow'
                        : 'text-gray-400 hover:text-white hover:bg-maze-wall/30 border-2 border-transparent'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {filteredSessions.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-gray-400 font-family-vt323 text-2xl'>
                  No {activeTab.toLowerCase()} games found
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {paginatedSessions.map((session) => (
                  <GameSessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};
