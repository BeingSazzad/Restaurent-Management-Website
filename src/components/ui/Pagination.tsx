'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
  className = '',
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, safeCurrentPage * pageSize);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (safeCurrentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', safeCurrentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={`bg-white border border-stone-200/90 rounded-2xl px-4 py-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600 select-none ${className}`}
    >
      {/* Left: Range and Total Display */}
      <div className="flex items-center gap-2 text-stone-500 font-medium">
        <span>
          Showing <strong className="text-stone-900 font-bold">{startItem}</strong>–
          <strong className="text-stone-900 font-bold">{endItem}</strong> of{' '}
          <strong className="text-stone-900 font-bold">{totalItems}</strong> items
        </span>
      </div>

      {/* Right: Items per page selector + Page numbers */}
      <div className="flex items-center gap-3 flex-wrap justify-between sm:justify-end">
        {/* Rows Per Page Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-stone-400 font-medium whitespace-nowrap">Show per page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="h-8 px-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-bold text-stone-800 outline-none cursor-pointer transition-colors"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-1">
          {/* Previous Page */}
          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage <= 1}
            className="h-8 px-2 rounded-lg border border-stone-200/80 bg-white hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-semibold">Prev</span>
          </button>

          {/* Numbered Page Buttons */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, idx) => {
              if (p === '...') {
                return (
                  <span key={`dots-${idx}`} className="px-1 text-stone-400 text-xs font-bold">
                    ...
                  </span>
                );
              }
              const pageNum = p as number;
              const isActive = pageNum === safeCurrentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
                      : 'border border-stone-200/80 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage >= totalPages}
            className="h-8 px-2 rounded-lg border border-stone-200/80 bg-white hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
            title="Next page"
          >
            <span className="hidden sm:inline text-[11px] font-semibold">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
