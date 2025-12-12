import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 py-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition-all hover:border-blue-400 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-300 disabled:hover:text-slate-600"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
                <div key={index}>
                    {page === '...' ? (
                        <span className="flex h-10 w-10 items-center justify-center text-slate-400">
                            ...
                        </span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page as number)}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg border font-medium transition-all ${currentPage === page
                                    ? 'border-blue-400 bg-blue-400 text-white'
                                    : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-400'
                                }`}
                        >
                            {page}
                        </button>
                    )}
                </div>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition-all hover:border-blue-400 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-300 disabled:hover:text-slate-600"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}
