import React, { useEffect } from 'react';
import { Card, Button } from '@/components/ui';
import { X } from 'lucide-react';

interface InformationModalProps {
  onClose: () => void;
}

export const InformationModal: React.FC<InformationModalProps> = ({
  onClose,
}) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <div className='absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50'>
      <Card className='bg-black border-4 border-pacman-yellow p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-pacman-yellow font-family-arcade text-3xl drop-shadow-lg'>
            About DCISMan
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
            aria-label='Close modal'
          >
            <X size={28} />
          </button>
        </div>

        <div className='space-y-6 font-family-vt323 text-xl text-gray-300'>
          <div>
            <h5 className='text-base leading-8'>
              DCISMan is a Pac-Man inspired web game featuring user
              authentication, leaderboards, and an admin panel. Test your
              skills, compete with friends, and climb to the top of the
              leaderboard! Developed as the finals submission project for CIS2103.
            </h5>
            <h5 className='mt-4 text-sm'>
              <a
                href='https://github.com/devliqht/dcisman'
                target='_blank'
                rel='noopener noreferrer'
                className='text-pacman-yellow hover:text-white transition-colors underline'
              >
                View on GitHub (open source)
              </a>
            </h5>
          </div>

          <div>
            <h3 className='text-ghost-pink text-2xl font-family-arcade mb-2'>
              Creator
            </h3>
            <h5 className='text-sm leading-relaxed'>
              Developed by{' '}
              <a
                href='https://mattliqht.dev'
                target='_blank'
                rel='noopener noreferrer'
                className='text-white font-bold hover:text-pacman-yellow transition-colors underline'
              >
                Matt Cabarrubias
              </a>
            </h5>
          </div>

          <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-pacman-yellow text-xl mb-1'>Frontend</h4>
                <ul className='space-y-1 pl-4'>
                  <li>• React with TypeScript</li>
                  <li>• Vite</li>
                  <li>• Tailwind CSS</li>
                  <li>• GSAP for animations</li>
                  <li>• Lucide React for icons</li>
                </ul>
              </div>
              <div>
                <h4 className='text-ghost-red text-xl mb-1'>Backend</h4>
                <ul className='space-y-1 pl-4'>
                  <li>• Spring Boot 3.2 (Java 21)</li>
                  <li>• Maven</li>
                  <li>• MySQL</li>
                  <li>• JWT Authentication</li>
                  <li>• Spring Security</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className='flex justify-center pt-4'>
            <Button
              onClick={onClose}
              variant='primary'
              className='font-family-arcade text-lg py-3 px-8'
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
