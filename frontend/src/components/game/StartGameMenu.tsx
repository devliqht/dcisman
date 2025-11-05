import React from 'react';

interface StartGameMenuProps {
  onStart: () => void;
}


export const StartGameMenu: React.FC<StartGameMenuProps> = ({ onStart }) => {
  return (
    <div className='text-center space-y-6'>
      <h1 className='text-pacman-yellow font-family-arcade text-6xl drop-shadow-lg'>
        DCISMan
      </h1>
      <button
        onClick={onStart}
        className='bg-pacman-yellow hover:bg-yellow-400 text-pacman-dark text-black font-family-arcade text-2xl px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 hover:cursor-pointer'
      >
        Start Game
      </button>
    </div>
  );
};
