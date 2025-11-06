import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import { getMyStats, formatTime, type UserStats } from '@/services/statsService';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getMyStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('failed to fetch stats:', err);
        setError('Failed to load your stats. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // ESC key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const calculateCompletionRate = () => {
    if (!stats || stats.totalGamesPlayed === 0) return 0;
    return ((stats.totalGamesCompleted / stats.totalGamesPlayed) * 100).toFixed(1);
  };

  return (
    <div className='min-h-screen bg-pacman-dark flex flex-col items-center justify-center p-6'>
      <Card className='w-full max-w-4xl bg-maze-wall/90 p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-4xl font-family-arcade text-pacman-yellow'>
            Your Stats
          </h1>
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
            <p className='text-white font-family-vt323 text-3xl'>Loading stats...</p>
          </div>
        )}

        {error && (
          <div className='text-center py-12'>
            <p className='text-ghost-red font-family-vt323 text-2xl mb-4'>{error}</p>
            <Button onClick={() => window.location.reload()} variant='primary'>
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && stats && (
          <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <StatCard
                label='Total Games'
                value={stats.totalGamesPlayed}
                color='text-ghost-cyan'
              />
              <StatCard
                label='Games Completed'
                value={stats.totalGamesCompleted}
                color='text-ghost-pink'
              />
              <StatCard
                label='Completion Rate'
                value={`${calculateCompletionRate()}%`}
                color='text-ghost-orange'
              />
            </div>

            <div>
              <h2 className='text-2xl font-family-arcade text-pacman-yellow mb-4'>
                Personal Bests
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <StatCard
                  label='Highest Score'
                  value={stats.highestScore.toLocaleString()}
                  color='text-pacman-yellow'
                  size='large'
                />
                <StatCard
                  label='Highest Level'
                  value={stats.highestLevelReached}
                  color='text-ghost-cyan'
                  size='large'
                />
                <StatCard
                  label='Longest Game'
                  value={formatTime(stats.longestTimePlayed)}
                  color='text-ghost-pink'
                  size='large'
                />
                <StatCard
                  label='Total Ghosts Eaten'
                  value={stats.totalGhostsEaten.toLocaleString()}
                  color='text-ghost-red'
                  size='large'
                />
              </div>
            </div>

            <div>
              <h2 className='text-2xl font-family-arcade text-pacman-yellow mb-4'>
                Lifetime Totals
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <StatCard
                  label='Power-Ups Used'
                  value={stats.totalPowerUpsUsed.toLocaleString()}
                  color='text-power-up'
                />
                <StatCard
                  label='Playing Since'
                  value={new Date(stats.createdAt).toLocaleDateString()}
                  color='text-white'
                />
              </div>
            </div>

            <div className='text-center mt-8'>
              <p className='text-gray-400 font-family-vt323 text-lg'>
                Last updated: {new Date(stats.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  size?: 'normal' | 'large';
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color,
  size = 'normal',
}) => {
  const valueSize = size === 'large' ? 'text-5xl' : 'text-4xl';
  const labelSize = size === 'large' ? 'text-xl' : 'text-lg';

  return (
    <div className='bg-pacman-dark/50 border-2 border-maze-blue rounded-lg p-6 text-center'>
      <p className={`${color} font-family-arcade ${valueSize} mb-2`}>{value}</p>
      <p className={`text-gray-300 font-family-vt323 ${labelSize}`}>{label}</p>
    </div>
  );
};
