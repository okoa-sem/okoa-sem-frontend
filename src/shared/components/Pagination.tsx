import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage < 4) return [...pages.slice(0, 5), '...', totalPages - 1];
    
    if (currentPage > totalPages - 5) return [0, '...', ...pages.slice(totalPages - 5)];

    return [0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1];
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0 || isLoading}
        className="p-2 rounded-lg bg-dark-card border border-dark-lighter hover:border-primary/50 text-text-gray hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {getVisiblePages().map((page, idx) => (
          <React.Fragment key={idx}>
            {page === '...' ? (
              <span className="text-text-gray px-2">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                disabled={isLoading}
                className={`
                  min-w-[40px] h-10 rounded-lg border font-medium transition-all
                  ${currentPage === page
                    ? 'bg-primary text-white border-primary'
                    : 'bg-dark-card border-dark-lighter text-text-gray hover:text-white hover:border-primary/50'
                  }
                `}
              >
                {(page as number) + 1}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1 || isLoading}
        className="p-2 rounded-lg bg-dark-card border border-dark-lighter hover:border-primary/50 text-text-gray hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
