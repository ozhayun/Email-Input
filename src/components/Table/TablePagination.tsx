"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalCount,
  onPrevious,
  onNext,
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 mt-6 rounded-xl border border-[#D6D8DD94] bg-white shadow-sm">
      <p className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
        <span className="ml-2 text-gray-400">
          ({totalCount} user{totalCount !== 1 ? "s" : ""})
        </span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
