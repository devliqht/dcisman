import React from 'react';

interface PauseMenuProps {
  onResume: () => void;
  onAbandon: () => void;
}


export const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onAbandon }) => {
  return (
    <div className='text-center space-y-6'>
      <h1 className='text-pacman-yellow font-family-arcade text-6xl drop-shadow-lg'>
        Game Paused
      </h1>
      <div className='flex flex-col gap-4'>
        <button
          onClick={onResume}
          className='bg-pacman-yellow hover:bg-yellow-400 text-pacman-dark font-family-arcade text-2xl px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102 text-black'
        >
          Resume Game
        </button>
        <button
          onClick={onAbandon}
          className='bg-ghost-red hover:bg-red-400 text-white font-family-arcade text-xl px-12 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'
        >
          Abandon Game
        </button>
      </div>
    </div>
  );
};
