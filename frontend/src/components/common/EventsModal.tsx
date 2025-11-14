import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Event } from '@/types/event';
import eventsData from '@/data/events.json';

interface EventsModalProps {
  onClose: () => void;
}

export const EventsModal: React.FC<EventsModalProps> = ({ onClose }) => {
  const [events] = useState<Event[]>(eventsData);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

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

  const currentEvent = events[currentEventIndex];

  const handlePrevious = () => {
    setCurrentEventIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1));
  };

  const handleNext = () => {
    setCurrentEventIndex((prev) => (prev < events.length - 1 ? prev + 1 : 0));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!currentEvent) {
    return (
      <div className='absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50'>
        <Card className='bg-black border-4 border-ghost-cyan p-6 max-w-2xl w-full mx-4'>
          <div className='text-center'>
            <h2 className='text-ghost-cyan font-family-arcade text-2xl mb-4'>
              No Events
            </h2>
            <p className='text-gray-300 font-family-vt323 text-xl mb-6'>
              There are currently no events to display.
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
      <Card className='bg-black border-4 border-ghost-cyan p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-ghost-cyan font-family-arcade text-2xl drop-shadow-lg'>
            Event Announcement
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
            aria-label='Close modal'
          >
            <X size={28} />
          </button>
        </div>

        <div className='space-y-8 font-family-vt323 text-xl text-gray-300'>
          {/* Event Title */}
          <div>
            <h3 className='text-pacman-yellow text-3xl font-family-arcade mb-2'>
              {currentEvent.title}
            </h3>
          </div>

          {/* Event Date Range */}
          <div>
            <h4 className='text-ghost-pink text-xl mb-1'>Event Duration</h4>
            <p className='text-2xl'>
              {formatDate(currentEvent.dateRange.start)} -{' '}
              {formatDate(currentEvent.dateRange.end)}
            </p>
          </div>

          {/* Event Description */}
          <div>
            <h4 className='text-ghost-orange text-xl mb-1'>Description</h4>
            <div className='text-3xl tracking-wide whitespace-pre-wrap'>
              {currentEvent.description}
            </div>
          </div>

          {/* Event Author and Published Date */}
          <div className='border-t-2 border-gray-700 pt-4 mt-4'>
            <div className='flex justify-between text-lg text-gray-400'>
              <span>Author: {currentEvent.author}</span>
              <span>Published: {formatDate(currentEvent.publishedDate)}</span>
            </div>
          </div>

          {/* Navigation and Close */}
          <div className='flex items-center justify-between pt-4 gap-4'>
            {events.length > 1 && (
              <div className='flex gap-2'>
                <Button
                  onClick={handlePrevious}
                  variant='secondary'
                  className='font-family-arcade text-sm py-2 px-3'
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  onClick={handleNext}
                  variant='secondary'
                  className='font-family-arcade text-sm py-2 px-3'
                >
                  <ChevronRight size={20} />
                </Button>
                <span className='text-gray-400 text-lg flex items-center'>
                  {currentEventIndex + 1} / {events.length}
                </span>
              </div>
            )}
            <Button
              onClick={onClose}
              variant='primary'
              className='font-family-arcade text-lg py-3 px-8 ml-auto'
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
