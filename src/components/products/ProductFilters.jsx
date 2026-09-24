import { memo } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import './ProductFilters.css';

/**
 * ARCHITECTURAL DECISION: Unified Product Filters Component
 * 
 * WHY SINGLE FILTER COMPONENT WITH RESPONSIVE CSS:
 * Avoids duplicating filter state and change handlers across desktop and mobile views.
 * Handles search, category, and sorting with strict conflict reconciliation rules.
 * 
 * DUMMYJSON BACKEND LIMITATION:
 * DummyJSON does not support simultaneous search (`/products/search?q=...`) and category
 * filtering (`/products/category/...`).
 * Therefore:
 * - Entering a search query immediately clears the category selection.
 * - Selecting a category immediately clears the search query.
 */
export const ProductFilters = memo(function ProductFilters({
  search = '',
  category = '',
  sort = '',
  categories = [],
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onResetFilters,
}) {
  const hasActiveFilters = Boolean(search || category || sort);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    onSearchChange(value);
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    onCategoryChange(value);
  };

  const handleSortSelect = (e) => {
    const value = e.target.value;
    onSortChange(value);
  };

  return (
    <div className="product-filters">
      {/* Search Input */}
      <div className="product-filters-item product-filters-search-wrapper">
        <label htmlFor="product-search-input" className="product-filters-label">
          Search Products
        </label>
        <div className="product-filters-input-group">
          <Search size={16} className="product-filters-search-icon" />
          <input
            id="product-search-input"
            type="text"
            value={search}
            onChange={handleSearchInput}
            placeholder="Search by title, brand..."
            className="product-filters-input"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="product-filters-clear-input-btn"
              aria-label="Clear search text"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="product-filters-item">
        <label htmlFor="product-category-select" className="product-filters-label">
          Category
        </label>
        <select
          id="product-category-select"
          value={category}
          onChange={handleCategorySelect}
          className="product-filters-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => {
            // DummyJSON returns either string slugs or { slug, name } objects
            const slug = typeof cat === 'string' ? cat : cat.slug;
            const name = typeof cat === 'string' ? cat : cat.name;
            return (
              <option key={slug} value={slug}>
                {name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="product-filters-item">
        <label htmlFor="product-sort-select" className="product-filters-label">
          Sort By
        </label>
        <select
          id="product-sort-select"
          value={sort}
          onChange={handleSortSelect}
          className="product-filters-select"
        >
          <option value="">Default (Featured)</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="rating-asc">Rating: Low to High</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="product-filters-actions">
          <button
            type="button"
            onClick={onResetFilters}
            className="product-filters-reset-btn"
          >
            <RotateCcw size={14} />
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </div>
  );
});
