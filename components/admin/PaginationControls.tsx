import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import ArrowRightIcon from '../icons/ArrowRightIcon';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-between items-center gap-2 mt-4 p-4 border-t border-border-color bg-surface rounded-b-lg">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-3 py-2 font-body font-semibold rounded-md transition-all duration-300 border bg-surface text-text-primary border-border-color hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go to previous page"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Previous</span>
      </button>

      <span className="text-sm text-text-secondary">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-3 py-2 font-body font-semibold rounded-md transition-all duration-300 border bg-surface text-text-primary border-border-color hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go to next page"
      >
        <span>Next</span>
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PaginationControls;