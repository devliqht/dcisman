import React, { useState, useEffect } from 'react';
import { gameTips } from '@/data/gameTips';

interface GameTipsProps {
  show: boolean;
}

export const GameTips: React.FC<GameTipsProps> = ({ show }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const tipDuration = 7000; // Show each tip for 7 seconds
    const fadeDuration = 500; // Fade animation duration

    const interval = setInterval(() => {
      // Start fade out
      setIsVisible(false);

      // After fade out completes, change tip and fade in
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % gameTips.length);
        setIsVisible(true);
      }, fadeDuration);
    }, tipDuration);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className='fixed bottom-4 right-4 z-40 max-w-lg'>
      <p
        className={`font-family-vt323 text-2xl text-gray-400 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {gameTips[currentTipIndex]}
      </p>
    </div>
  );
};
