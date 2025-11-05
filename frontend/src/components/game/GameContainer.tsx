import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import { GameEngine } from '@/game/GameEngine';
import { GameOverModal } from './GameOverModal';
import { ConfirmationModal } from './ConfirmationModal';
import { InGameStats } from './InGameStats';
import { StartGameMenu } from './StartGameMenu';
import { PauseMenu } from './PauseMenu';
import { UserInfoCards } from './UserInfoCards';
import { PauseIcon } from './icons';
import {
  startGameSession,
  updateGameSession,
  endGameSession,
  type GameSessionData,
} from '@/services/gameSessionService';
import { getMyStats, type UserStats } from '@/services/statsService';

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
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isPausedState, setIsPausedState] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [completedSession, setCompletedSession] =
    useState<GameSessionData | null>(null);
  const [currentSession, setCurrentSession] = useState<GameSessionData | null>(
    null
  );
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [showRecentGamesConfirm, setShowRecentGamesConfirm] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const updateIntervalRef = useRef<number | null>(null);
  const currentSessionRef = useRef<GameSessionData | null>(null);

  // sync current session ref
  useEffect(() => {
    currentSessionRef.current = currentSession;
  }, [currentSession]);

  // fetch user stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getMyStats();
        setUserStats(stats);
      } catch (error) {
        console.error('failed to fetch user stats:', error);
      }
    };
    fetchStats();
  }, []);

  // refetch stats helper
  const refetchStats = async () => {
    try {
      const stats = await getMyStats();
      setUserStats(stats);
    } catch (error) {
      console.error('failed to refetch stats:', error);
    }
  };

  // end session helper
  const endSession = useCallback(
    async (status: 'COMPLETED' | 'ABANDONED') => {
      const session = currentSessionRef.current;
      const engine = engineRef.current;

      if (session && engine) {
        try {
          const endedSession = await endGameSession(session.id, {
            score: engine.getScore(),
            levelReached: engine.getLevel(),
            durationSeconds: engine.getGameTime(),
            ghostsEaten: engine.getGhostsEaten(),
            powerUpsUsed: engine.getPowerUpsUsed(),
            status,
          });

          if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
          }

          setCurrentSession(null);
          setCompletedSession(endedSession);
          setShowGameOver(true);
          onStateChange('idle');
          setShowOverlay(true);
          setIsPausedState(false);

          await refetchStats();
        } catch (error) {
          console.error('failed to end game session:', error);
        }
      }
    },
    [onStateChange]
  );

  const handleGameOver = useCallback(async () => {
    await endSession('COMPLETED');
  }, [endSession]);

  const handlePause = useCallback(async () => {
    engineRef.current?.pause();
    onStateChange('paused');
    setShowOverlay(true);
    setIsPausedState(true);

    if (currentSession && engineRef.current) {
      try {
        await updateGameSession(currentSession.id, {
          score: engineRef.current.getScore(),
          levelReached: engineRef.current.getLevel(),
          durationSeconds: engineRef.current.getGameTime(),
          ghostsEaten: engineRef.current.getGhostsEaten(),
          powerUpsUsed: engineRef.current.getPowerUpsUsed(),
        });
      } catch (error) {
        console.error('failed to update session on pause:', error);
      }
    }
  }, [currentSession, onStateChange]);

  const handleResume = useCallback(() => {
    engineRef.current?.resume();
    onStateChange('playing');
    setShowOverlay(false);
    setIsPausedState(false);
  }, [onStateChange]);

  const handleAbandonClick = () => setShowAbandonConfirm(true);

  const handleAbandonConfirm = useCallback(async () => {
    setShowAbandonConfirm(false);
    await endSession('ABANDONED');
    engineRef.current?.reset();
  }, [endSession]);

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new GameEngine(canvasRef.current, handleGameOver);
    }

    return () => {
      const session = currentSessionRef.current;
      const engine = engineRef.current;

      if (session && engine) {
        endGameSession(session.id, {
          score: engine.getScore(),
          levelReached: engine.getLevel(),
          durationSeconds: engine.getGameTime(),
          ghostsEaten: engine.getGhostsEaten(),
          powerUpsUsed: engine.getPowerUpsUsed(),
          status: 'ABANDONED',
        }).catch(error => {
          console.error('failed to end session on cleanup:', error);
        });
      }

      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }

      engineRef.current?.destroy();
    };
  }, [handleGameOver]);

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
  }, [gameState, handlePause, handleResume]);

  const handleStart = async () => {
    try {
      setShowGameOver(false);
      setCompletedSession(null);

      const session = await startGameSession();
      setCurrentSession(session);

      engineRef.current?.start();
      onStateChange('playing');
      setShowOverlay(false);
      setIsPausedState(false);

      updateIntervalRef.current = window.setInterval(() => {
        if (engineRef.current && session) {
          updateGameSession(session.id, {
            score: engineRef.current.getScore(),
            levelReached: engineRef.current.getLevel(),
            durationSeconds: engineRef.current.getGameTime(),
            ghostsEaten: engineRef.current.getGhostsEaten(),
            powerUpsUsed: engineRef.current.getPowerUpsUsed(),
          }).catch(error => {
            console.error('failed to update session:', error);
          });
        }
      }, 5000);

      if (canvasRef.current) {
        canvasRef.current.focus({ preventScroll: true });
      }
    } catch (error) {
      console.error('failed to start game session:', error);
    }
  };

  const handlePlayAgain = () => {
    setShowGameOver(false);
    setCompletedSession(null);
    engineRef.current?.reset();
    handleStart();
  };

  const handleViewRecentGamesClick = () => {
    if (currentSession && (isPausedState || gameState === 'playing')) {
      setShowRecentGamesConfirm(true);
    } else {
      navigate('/recent-games');
    }
  };

  const handleViewRecentGamesConfirm = () => {
    setShowRecentGamesConfirm(false);
    navigate('/recent-games');
  };

  return (
    <Card className='py-0 p-6 bg-maze-wall/90'>
      {showGameOver && (
        <GameOverModal
          session={completedSession}
          onPlayAgain={handlePlayAgain}
          onViewRecentGames={handleViewRecentGamesClick}
          onLogout={onLogout}
        />
      )}

      {showAbandonConfirm && (
        <ConfirmationModal
          title='Abandon Game?'
          message='This will end your current session. All progress will be lost.'
          confirmText='Abandon'
          cancelText='Cancel'
          confirmVariant='danger'
          onConfirm={handleAbandonConfirm}
          onCancel={() => setShowAbandonConfirm(false)}
        />
      )}

      {showRecentGamesConfirm && (
        <ConfirmationModal
          title='View Recent Games?'
          message='Leaving will abandon your current session.'
          confirmText='Continue'
          cancelText='Stay'
          confirmVariant='primary'
          onConfirm={handleViewRecentGamesConfirm}
          onCancel={() => setShowRecentGamesConfirm(false)}
        />
      )}

      <div className='flex gap-6 items-center justify-center'>
        {!showOverlay && gameState === 'playing' ? (
          <div className='flex items-center'>
            <button
              onClick={handlePause}
              className='border-2 border-pacman-yellow text-pacman-yellow hover:bg-pacman-yellow hover:text-pacman-dark font-family-arcade text-3xl w-14 h-14 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center'
              title='Pause (ESC or Space)'
            >
              <PauseIcon />
            </button>
          </div>
        ) : (
          <div className='w-14'></div>
        )}

        <div className='flex items-center justify-center bg-pacman-dark rounded-lg overflow-hidden relative shrink-0'>
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
              {!isPausedState ? (
                <StartGameMenu onStart={handleStart} />
              ) : (
                <PauseMenu
                  onResume={handleResume}
                  onAbandon={handleAbandonClick}
                />
              )}

              <UserInfoCards
                username={user?.username || ''}
                userStats={userStats}
                onLogout={onLogout}
                onViewRecentGames={handleViewRecentGamesClick}
              />
            </div>
          )}
        </div>

        {gameState === 'playing' ? (
          <InGameStats highScore={userStats?.highestScore || 0} />
        ) : (
          <div className='w-[200px]'></div>
        )}
      </div>
    </Card>
  );
};
