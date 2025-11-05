import React, { useRef, useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { GameEngine } from '@/game/GameEngine';
import { InfoCard } from './InfoCard';
import { GameStat } from './GameStat';
import { UserIcon, StatsIcon, GamesIcon } from './icons';

interface GameContainerProps {
  gameState: 'idle' | 'playing' | 'paused';
  onStateChange: (state: 'idle' | 'playing' | 'paused') => void;
  user: { username: string } | null;
  onLogout: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  gameState,
  onStateChange,
  user,
  onLogout,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isPausedState, setIsPausedState] = useState(false);

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new GameEngine(canvasRef.current);
    }

    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        if (gameState === 'playing') {
          handlePause();
        } else if (gameState === 'paused') {
          handleResume();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const handleStart = () => {
    engineRef.current?.start();
    onStateChange('playing');
    setShowOverlay(false);
    setIsPausedState(false);
    if (canvasRef.current) {
      canvasRef.current.focus({ preventScroll: true });
    }
  };

  const handlePause = () => {
    engineRef.current?.pause();
    onStateChange('paused');
    setShowOverlay(true);
    setIsPausedState(true);
  };

  const handleResume = () => {
    engineRef.current?.resume();
    onStateChange('playing');
    setShowOverlay(false);
    setIsPausedState(false);
  };

  return (
    <Card className='py-0 p-6 bg-maze-wall/90'>
      <div className='flex gap-6 items-center justify-center'>
        {!showOverlay && gameState === 'playing' ? (
          <div className='flex items-center'>
            <button
              onClick={handlePause}
              className='border-2 border-pacman-yellow text-pacman-yellow hover:bg-pacman-yellow hover:text-pacman-dark font-family-arcade text-3xl w-14 h-14 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center'
              title='Pause (ESC or Space)'
            >
              ⏸
            </button>
          </div>
        ) : (
          <div className='w-14'></div>
        )}

        {/* Canvas Container */}
        <div className='flex items-center justify-center bg-pacman-dark rounded-lg overflow-hidden relative flex-shrink-0'>
          <canvas
            ref={canvasRef}
            width={864}
            height={960}
            tabIndex={0}
            className={`border-4 border-maze-blue focus:outline-none focus:ring-2 focus:ring-pacman-yellow transition-all duration-300 ${
              showOverlay ? 'blur-sm' : 'blur-none'
            }`}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              height: 'auto',
              width: 'auto',
              objectFit: 'contain',
            }}
          />

          {showOverlay && (
            <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm'>
              <div className='text-center space-y-6'>
                {!isPausedState && (
                  <>
                    <h1 className='text-pacman-yellow font-family-arcade text-6xl drop-shadow-lg'>
                      DCISMan Game
                    </h1>
                    <button
                      onClick={handleStart}
                      className='bg-pacman-yellow hover:bg-yellow-400 text-pacman-dark text-black font-family-arcade text-2xl px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'
                    >
                      Start Game
                    </button>
                  </>
                )}
                {isPausedState && (
                  <>
                    <h1 className='text-ghost-cyan font-family-arcade text-6xl drop-shadow-lg'>
                      Game Paused
                    </h1>
                    <button
                      onClick={handleResume}
                      className='bg-ghost-cyan hover:bg-cyan-400 text-pacman-dark font-family-arcade text-2xl px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'
                    >
                      Resume Game
                    </button>
                  </>
                )}
              </div>
              {/* Info Cards */}
              <div className='grid grid-cols-3 gap-4'>
                <InfoCard icon={<UserIcon />} title={user?.username || ''}>
                  <Button
                    onClick={onLogout}
                    variant='secondary'
                    className='w-full font-family-vt323 text-2xl! p-2!'
                  >
                    Logout
                  </Button>
                </InfoCard>

                <InfoCard icon={<StatsIcon />} title='Your Stats'>
                  <p className='text-gray-400 font-family-vt323 text-base'>
                    Coming soon
                  </p>
                </InfoCard>

                <InfoCard icon={<GamesIcon />} title='Recent Games'>
                  <p className='text-gray-400 font-family-vt323 text-base'>
                    No games yet
                  </p>
                </InfoCard>
              </div>
            </div>
          )}
        </div>

        {gameState === 'playing' ? (
          <div className='flex flex-col gap-6 min-w-[200px]'>
            <GameStat
              label='Score'
              value='0'
              id='game-score'
              valueClassName='text-pacman-yellow'
            />
            <GameStat
              label='Level'
              value='1'
              id='game-level'
              valueClassName='text-ghost-cyan'
            />
            <GameStat
              label='Lives'
              value='3'
              id='game-lives'
              valueClassName='text-ghost-red'
            />
          </div>
        ) : (
          <div className='w-[200px]'></div>
        )}
      </div>
    </Card>
  );
};
