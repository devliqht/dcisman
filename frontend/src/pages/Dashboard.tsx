import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout';
import { GameContainer } from '@/components/game/GameContainer';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused'>(
    'idle'
  );

  return (
    <MainLayout>
      <div className='min-h-screen bg-pacman-dark flex items-center justify-center'>
        <div className='w-full max-w-[900px] px-4'>
          <GameContainer
            gameState={gameState}
            onStateChange={setGameState}
            user={user}
            onLogout={logout}
          />
        </div>
      </div>
    </MainLayout>
  );
};
