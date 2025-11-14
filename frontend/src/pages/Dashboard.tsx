import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout';
import { GameContainer } from '@/components/game/GameContainer';
import { GameTips } from '@/components/game/GameTips';
import { BuildInfo } from '@/components/game/BuildInfo';
import { InformationModal } from '@/components/common/InformationModal';
import { EventsModal } from '@/components/common/EventsModal';
import { InfoIcon } from '@/components/game/icons/InfoIcon';
import { EventsIcon } from '@/components/game/icons/EventsIcon';
import type { Event } from '@/types/event';
import eventsData from '@/data/events.json';

export const Dashboard: React.FC = () => {
  const { user, logout, isGuest } = useAuth();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused'>(
    'idle'
  );
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);

  const events: Event[] = eventsData;
  const latestEvent = events.length > 0 ? events[0] : null;

  return (
    <MainLayout>
      <div className='h-screen bg-pacman-dark flex items-center justify-center overflow-hidden'>
        <div className='w-full h-full flex items-center justify-center p-4'>
          <GameContainer
            gameState={gameState}
            onStateChange={setGameState}
            user={user}
            onLogout={logout}
            isGuest={isGuest}
          />
        </div>
        <BuildInfo />
        <GameTips show={gameState !== 'playing'} />

        {gameState !== 'playing' && latestEvent && (
          <button
            onClick={() => setShowEventsModal(true)}
            className='fixed top-4 right-20 z-40 bg-ghost-cyan/20 hover:bg-ghost-cyan/30 border-4 border-ghost-cyan transition-all duration-200 group pixelated px-3 py-2 flex items-center gap-2'
            style={{ imageRendering: 'pixelated' }}
            aria-label='Show events'
          >
            <div className='text-ghost-cyan group-hover:text-white transition-colors'>
              <EventsIcon />
            </div>
            <span className='text-ghost-cyan group-hover:text-white transition-colors font-family-arcade text-sm whitespace-nowrap'>
              {latestEvent.title}
            </span>
          </button>
        )}

        {gameState !== 'playing' && (
          <button
            onClick={() => setShowInfoModal(true)}
            className='fixed top-4 right-4 z-40 bg-pacman-yellow/20 hover:bg-pacman-yellow/30 border-4 border-pacman-yellow transition-all duration-200 group pixelated p-2'
            style={{ imageRendering: 'pixelated' }}
            aria-label='Show information'
          >
            <div className='text-pacman-yellow group-hover:text-white transition-colors'>
              <InfoIcon />
            </div>
          </button>
        )}

        {showEventsModal && (
          <EventsModal onClose={() => setShowEventsModal(false)} />
        )}

        {showInfoModal && (
          <InformationModal onClose={() => setShowInfoModal(false)} />
        )}
      </div>
    </MainLayout>
  );
};
