import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { X } from 'lucide-react';
import type { Changelog } from '@/types/changelog';
import changelogsData from '@/data/changelogs.json';

interface ChangelogModalProps {
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
  const [changelogs] = useState<Changelog[]>(changelogsData);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

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

  const selectedChangelog = changelogs[selectedVersionIndex];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!selectedChangelog) {
    return (
      <div className='absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50'>
        <Card className='bg-black border-4 border-ghost-cyan p-6 max-w-2xl w-full mx-4'>
          <div className='text-center'>
            <h2 className='text-ghost-cyan font-family-arcade text-2xl mb-4'>
              No Changelog
            </h2>
            <p className='text-gray-300 font-family-vt323 text-xl mb-6'>
              There is currently no changelog to display.
            </p>
            <Button
              onClick={onClose}
              variant='primary'
              className='font-family-arcade text-lg py-3 px-8'
            >
              Close
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50'>
      <Card className='bg-black border-4 border-ghost-cyan p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col'>
        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-ghost-cyan font-family-arcade text-2xl drop-shadow-lg'>
            Changelog
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
            aria-label='Close modal'
          >
            <X size={28} />
          </button>
        </div>

        <div className='flex gap-6 flex-1 overflow-hidden'>
          <div className='w-48 shrink-0 overflow-y-auto border-r-2 border-gray-700 pr-4'>
            <div className='space-y-2'>
              {changelogs.map((changelog, index) => (
                <button
                  key={changelog.version}
                  onClick={() => setSelectedVersionIndex(index)}
                  className={`w-full text-left px-4 py-3 rounded transition-colors font-family-vt323 text-xl ${
                    index === selectedVersionIndex
                      ? 'bg-ghost-cyan text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <h5 className='font-bold text-sm'>{changelog.version}</h5>
                  <div className='text-sm opacity-80'>
                    {new Date(changelog.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className='flex-1 overflow-y-auto'>
            <div className='space-y-6 font-family-vt323'>
              <div>
                <h3 className='text-pacman-yellow text-3xl font-family-arcade mb-2'>
                  {selectedChangelog.version}
                </h3>
                <h5 className='text-gray-400 text-sm'>
                  Released: {formatDate(selectedChangelog.date)}
                </h5>
              </div>

              {selectedChangelog.changes.map((changeCategory, idx) => (
                <div key={idx}>
                  <h4 className='text-ghost-pink text-2xl mb-3 font-bold'>
                    {changeCategory.category}
                  </h4>
                  <ul className='space-y-2 text-gray-300 text-xl'>
                    {changeCategory.items.map((item, itemIdx) => (
                      <li key={itemIdx} className='flex items-start'>
                        <span className='text-ghost-orange mr-2'>•</span>
                        <span className="text-2xl">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='flex justify-end pt-4 mt-4 border-t-2 border-gray-700'>
          <Button
            onClick={onClose}
            variant='primary'
            className='font-family-arcade text-lg py-3 px-8'
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};
