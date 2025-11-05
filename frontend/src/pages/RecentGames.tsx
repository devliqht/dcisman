import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import {
  getUserSessions,
  type GameSessionData,
} from '@/services/gameSessionService';
import { useAuth } from '@/hooks/useAuth';

export const RecentGames: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<GameSessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'ABANDONED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <div className='min-h-screen bg-pacman-dark flex flex-col items-center justify-center p-4'>
      <div className='w-full max-w-5xl'>
        <div className='text-center mb-8'>
          <h1 className='text-pacman-yellow font-family-arcade text-5xl drop-shadow-lg mb-4'>
            Recent Games
          </h1>
          <p className='text-gray-400 font-family-vt323 text-2xl mb-6'>
            {user?.username}'s Game History
          </p>
          <Button
            onClick={() => navigate('/')}
            className='bg-ghost-cyan hover:bg-cyan-400 text-pacman-dark font-family-arcade text-xl px-8 py-3'
          >
            Back to Game
          </Button>
        </div>

        <Card className='bg-maze-wall/90 border-4 border-maze-blue p-6'>
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

          {!loading && !error && sessions.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-400 font-family-vt323 text-2xl mb-4'>
                No games played yet
              </p>
              <p className='text-gray-500 font-family-vt323 text-lg'>
                Start playing to see your game history!
              </p>
            </div>
          )}

          {!loading && !error && sessions.length > 0 && (
            <div className='space-y-4'>
              {sessions.map(session => (
                <GameSessionCard
                  key={session.id}
                  session={session}
                  formatTime={formatTime}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

interface GameSessionCardProps {
  session: GameSessionData;
  formatTime: (seconds: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
}

const GameSessionCard: React.FC<GameSessionCardProps> = ({
  session,
  formatTime,
  formatDate,
  getStatusColor,
}) => {
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

interface StatBoxProps {
  label: string;
  value: string;
  color?: string;
}

const StatBox: React.FC<StatBoxProps> = ({
  label,
  value,
  color = 'text-white',
}) => {
  return (
    <div className='text-center'>
      <p className='text-gray-500 font-family-vt323 text-xl uppercase mb-1'>
        {label}
      </p>
      <p className={`font-family-arcade text-xl ${color}`}>{value}</p>
    </div>
  );
};
