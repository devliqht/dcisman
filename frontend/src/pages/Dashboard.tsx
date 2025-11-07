import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout';
import { GameContainer } from '@/components/game/GameContainer';
import { GameTips } from '@/components/game/GameTips';
import { BuildInfo } from '@/components/game/BuildInfo';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused'>(
    'idle'
  );

  return (
    <MainLayout>
      <div className='h-screen bg-pacman-dark flex items-center justify-center overflow-hidden'>
        <div className='w-full h-full flex items-center justify-center p-4'>
          <GameContainer
            gameState={gameState}
            onStateChange={setGameState}
            user={user}
            onLogout={logout}
          />
        </div>
        <BuildInfo />
        <GameTips show={gameState !== 'playing'} />
      </div>
    </MainLayout>
  );
};
