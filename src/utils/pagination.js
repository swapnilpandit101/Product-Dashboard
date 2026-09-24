/**
 * ARCHITECTURAL DECISION: Pure Pagination Utilities
 * 
 * WHY THIS UTILITY IS EXTRACTED:
 * 1. Single Responsibility: Keeps mathematical pagination logic separated from UI rendering.
 * 2. High Testability & Reusability: Used consistently across desktop table and mobile card pagination.
 * 3. Safe Clamping: Prevents negative offsets, NaN results, and out-of-bounds page requests.
 */

/**
 * Calculate API skip offset from current 1-indexed page and page size
 */
export function calculateSkip(page, pageSize) {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safePageSize = Math.max(1, parseInt(pageSize, 10) || 10);
  return (safePage - 1) * safePageSize;
}

/**
 * Calculate total pages from total items and page size
 */
export function calculateTotalPages(total, pageSize) {
  const safeTotal = Math.max(0, parseInt(total, 10) || 0);
  const safePageSize = Math.max(1, parseInt(pageSize, 10) || 10);
  return Math.ceil(safeTotal / safePageSize) || 1;
}

/**
 * Calculate human-readable range indices ("Showing fromIndex to toIndex of total")
 */
export function calculatePaginationRange(total, page, pageSize) {
  const safeTotal = Math.max(0, parseInt(total, 10) || 0);
  if (safeTotal === 0) {
    return { from: 0, to: 0, total: 0 };
  }
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safePageSize = Math.max(1, parseInt(pageSize, 10) || 10);
  
  const from = (safePage - 1) * safePageSize + 1;
  const to = Math.min(safePage * safePageSize, safeTotal);
  
  return { from, to, total: safeTotal };
}

/**
 * Generate a clean array of visible page numbers for pagination controls
 * Returns array with numbers and optional '...' strings
 */
export function getVisiblePageNumbers(currentPage, totalPages, maxVisible = 5) {
  const safeCurrent = Math.min(Math.max(1, currentPage), totalPages);
  
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const sidePages = Math.floor((maxVisible - 2) / 2);
  
  let start = Math.max(2, safeCurrent - sidePages);
  let end = Math.min(totalPages - 1, safeCurrent + sidePages);

  if (safeCurrent <= sidePages + 2) {
    end = Math.min(totalPages - 1, maxVisible - 1);
    start = 2;
  } else if (safeCurrent >= totalPages - (sidePages + 1)) {
    start = Math.max(2, totalPages - (maxVisible - 2));
    end = totalPages - 1;
  }

  pages.push(1);
  if (start > 2) {
    pages.push('...');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push('...');
  }
  pages.push(totalPages);

  return pages;
}
