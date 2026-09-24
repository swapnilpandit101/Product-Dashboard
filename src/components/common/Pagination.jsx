import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  calculateTotalPages,
  calculatePaginationRange,
  getVisiblePageNumbers,
} from '../../utils/pagination';
import './Pagination.css';

/**
 * ARCHITECTURAL DECISION: Reusable Responsive Pagination Component
 * 
 * WHY THIS COMPONENT EXISTS:
 * Encapsulates full pagination presentation and interaction.
 * - Desktop: Complete page range with individual page buttons and info summary.
 * - Mobile: Compact prev/next layout with page indicator, preventing horizontal overflow.
 */
export function Pagination({
  total = 0,
  page = 1,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = useMemo(
    () => calculateTotalPages(total, pageSize),
    [total, pageSize]
  );

  const range = useMemo(
    () => calculatePaginationRange(total, page, pageSize),
    [total, page, pageSize]
  );

  const pageNumbers = useMemo(
    () => getVisiblePageNumbers(page, totalPages, 5),
    [page, totalPages]
  );

  if (total <= 0) {
    return null;
  }

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <span className="pagination-highlight">{range.from}</span> to{' '}
        <span className="pagination-highlight">{range.to}</span> of{' '}
        <span className="pagination-highlight">{range.total}</span> products
      </div>

      <div className="pagination-controls">
        {onPageSizeChange && (
          <div className="pagination-size-selector">
            <label htmlFor="pagination-size-select" className="pagination-size-label">
              Per page:
            </label>
            <select
              id="pagination-size-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="pagination-size-select"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pagination-buttons">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={isFirstPage}
            className="pagination-btn pagination-btn-prev"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>

          {/* Desktop full page numbers */}
          <div className="pagination-numbers-desktop">
            {pageNumbers.map((item, index) => {
              if (item === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                    ...
                  </span>
                );
              }
              const isActive = item === page;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPageChange(item)}
                  className={`pagination-btn pagination-btn-number ${
                    isActive ? 'pagination-btn-active' : ''
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Mobile compact page indicator */}
          <div className="pagination-indicator-mobile">
            Page {page} of {totalPages}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={isLastPage}
            className="pagination-btn pagination-btn-next"
            aria-label="Next page"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
