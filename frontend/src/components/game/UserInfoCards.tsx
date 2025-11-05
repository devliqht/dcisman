import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { InfoCard } from './InfoCard';
import { UserIcon, StatsIcon, GamesIcon, TrophyIcon } from './icons';
import { type UserStats } from '@/services/statsService';

interface UserInfoCardsProps {
  username: string;
  userStats: UserStats | null;
  onLogout: () => void;
  onViewRecentGames: () => void;
}

export const UserInfoCards: React.FC<UserInfoCardsProps> = ({
  username,
  userStats,
  onLogout,
  onViewRecentGames,
}) => {
  const navigate = useNavigate();

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8'>
      <InfoCard icon={<UserIcon />} title={username}>
        <Button
          onClick={onLogout}
          variant='secondary'
          className='w-full font-family-vt323 text-2xl! p-2!'
        >
          Logout
        </Button>
      </InfoCard>

      <InfoCard icon={<StatsIcon />} title='Your Stats'>
        {userStats ? (
          <>
            <div className='space-y-1 mb-2'>
              <p className='text-pacman-yellow font-family-vt323 text-xl font-bold'>
                High Score: {userStats.highestScore.toLocaleString()}
              </p>
              <p className='text-gray-400 font-family-vt323 text-base'>
                Level {userStats.highestLevelReached}
              </p>
            </div>
            <Button
              onClick={() => navigate('/profile')}
              variant='secondary'
              className='w-full font-family-vt323 text-2xl! p-2!'
            >
              View Profile
            </Button>
          </>
        ) : (
          <p className='text-gray-400 font-family-vt323 text-base'>
            Loading...
          </p>
        )}
      </InfoCard>

      <InfoCard icon={<GamesIcon />} title='Recent Games'>
        <Button
          onClick={onViewRecentGames}
          variant='secondary'
          className='w-full font-family-vt323 text-2xl! p-2!'
        >
          View Games
        </Button>
      </InfoCard>

      <InfoCard icon={<TrophyIcon />} title='Leaderboards'>
        <Button
          onClick={() => navigate('/leaderboards')}
          variant='secondary'
          className='w-full font-family-vt323 text-2xl! p-2!'
        >
          View Ranks
        </Button>
      </InfoCard>
    </div>
  );
};
