import React from 'react';
import { Button } from '@/components/ui';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageClick: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onPageClick,
}) => {
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < Math.min(4, totalPages); i++) {
          pages.push(i);
        }
        pages.push(-1); // ellipsis
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(0);
        pages.push(-1); // ellipsis
        for (let i = Math.max(0, totalPages - 4); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(0);
        pages.push(-1); // ellipsis
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(-2); // ellipsis
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  return (
    <div className='flex items-center justify-center gap-2'>
      <Button
        onClick={onPrevious}
        disabled={currentPage === 0}
        variant='secondary'
        className='font-family-vt323 text-lg! px-3! py-1! disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Previous
      </Button>

      <div className='flex gap-1'>
        {getPageNumbers().map((page, index) => {
          if (page === -1 || page === -2) {
            return (
              <span
                key={`ellipsis-${index}`}
                className='text-gray-400 font-family-vt323 text-lg px-1'
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageClick(page)}
              className={`px-3 py-1 rounded-lg font-family-vt323 text-lg transition-all duration-200 ${
                currentPage === page
                  ? 'bg-pacman-yellow text-pacman-dark'
                  : 'bg-maze-wall/50 text-white hover:bg-maze-wall/70'
              }`}
            >
              {page + 1}
            </button>
          );
        })}
      </div>

      <Button
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        variant='secondary'
        className='font-family-vt323 text-lg! px-3! py-1! disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Next
      </Button>
    </div>
  );
};
