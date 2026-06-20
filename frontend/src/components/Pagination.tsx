import type { PaginationProps } from "@shared/types";

export default function Pagination({ currentPage, totalPages, loading, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-between items-center mt-4">
            <button
                disabled={currentPage === 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            <span className="text-sm text-gray-600">
                Showing Page <strong className="text-gray-900">{currentPage}</strong> of {totalPages}
            </span>
            <button
                disabled={currentPage === totalPages || loading}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
}