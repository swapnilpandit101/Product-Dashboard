import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { productService } from '../services/product.service';
import { calculateSkip } from '../utils/pagination';
import { useDebounce } from '../hooks/useDebounce';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductTable } from '../components/products/ProductTable';
import { ProductCard } from '../components/products/ProductCard';
import { Pagination } from '../components/common/Pagination';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { useToast } from '../context/ToastContext';
import './ProductsPage.css';

/**
 * ARCHITECTURAL DECISION: Products Inventory Page
 * 
 * WHY URL STATE SYNCHRONIZATION:
 * All search, category, sort, page, and pageSize parameters are stored in the URL query string.
 * This ensures sharing links, browser refreshes, and back/forward buttons work flawlessly.
 * 
 * WHY ABORTCONTROLLER RACE-CONDITION PROTECTION:
 * High typing speed produces rapid in-flight requests. By tracking and aborting preceding
 * controllers, we guarantee that older, slower network responses never overwrite fresh search results.
 */
export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. Extract & Safely Normalize URL Parameters
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const rawPageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const pageSize = [10, 20, 50].includes(rawPageSize) ? rawPageSize : 10;

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || '';

  // Local state for immediate input feedback before debounce
  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Data & Lifecycle state
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Keep a reference to the active AbortController
  const abortControllerRef = useRef(null);

  // Sync searchInput when URL search changes externally (e.g. Back button)
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Sync debounced search to URL query params
  useEffect(() => {
    // Only commit to URL if the debounced value has caught up with current input and differs from URL
    if (
      debouncedSearch === searchInput &&
      debouncedSearch.trim() !== searchParam.trim()
    ) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (debouncedSearch.trim()) {
            next.set('search', debouncedSearch.trim());
            // Clear category when search is entered
            next.delete('category');
          } else {
            next.delete('search');
          }
          next.set('page', '1'); // Reset to page 1 on search change
          return next;
        },
        { replace: true }
      );
    }
  }, [debouncedSearch, searchInput, searchParam, setSearchParams]);

  // Fetch Category List once on mount
  useEffect(() => {
    let isMounted = true;
    productService
      .getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch categories list:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Parse sortParam into DummyJSON sortBy and order parameters
  const { sortBy, order } = useMemo(() => {
    if (!sortParam) return { sortBy: undefined, order: undefined };
    const [field, dir] = sortParam.split('-');
    return { sortBy: field, order: dir || 'asc' };
  }, [sortParam]);

  // Primary Data Fetcher with AbortController
  const fetchProducts = useCallback(async () => {
    // Abort previous in-flight request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError('');

    const skip = calculateSkip(page, pageSize);

    try {
      let data;
      if (searchParam) {
        data = await productService.searchProducts({
          q: searchParam,
          limit: pageSize,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
      } else if (categoryParam) {
        data = await productService.getProductsByCategory({
          category: categoryParam,
          limit: pageSize,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
      } else {
        data = await productService.getProducts({
          limit: pageSize,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
      }

      setProducts(data.products || []);
      setTotal(data.total || 0);

      // Safe normalization: If page > totalPages, clamp URL page to max
      const totalPages = Math.ceil((data.total || 0) / pageSize) || 1;
      if (page > totalPages) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(totalPages));
          return next;
        });
      }
    } catch (err) {
      // Ignore AbortController / Axios cancellations silently
      if (axios.isCancel(err) || err.name === 'CanceledError') {
        return;
      }
      setError(
        err.response?.data?.message ||
          'Failed to load products. Please check your connection and try again.'
      );
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [page, pageSize, searchParam, categoryParam, sortBy, order, setSearchParams]);

  useEffect(() => {
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  // Filter Handlers
  const handleSearchChange = (newSearch) => {
    setSearchInput(newSearch);
    // If search is cleared immediately (e.g. clear button clicked), clear URL without waiting 400ms
    if (!newSearch.trim()) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (next.has('search')) {
            next.delete('search');
            next.set('page', '1');
          }
          return next;
        },
        { replace: true }
      );
    }
  };

  const handleCategoryChange = (newCategory) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newCategory) {
        next.set('category', newCategory);
        // Clear search when category is selected
        next.delete('search');
      } else {
        next.delete('category');
      }
      next.set('page', '1');
      return next;
    });
    setSearchInput('');
  };

  const handleSortChange = (newSort) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newSort) {
        next.set('sort', newSort);
      } else {
        next.delete('sort');
      }
      next.set('page', '1');
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      // Retain custom pageSize if selected
      const currentPageSize = prev.get('pageSize');
      if (currentPageSize && currentPageSize !== '10') {
        next.set('pageSize', currentPageSize);
      }
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  const handlePageSizeChange = (newPageSize) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('pageSize', String(newPageSize));
      next.set('page', '1');
      return next;
    });
  };

  // Action Navigation Handlers
  const handleViewProduct = useCallback(
    (id) => {
      navigate(`/products/${id}`);
    },
    [navigate]
  );

  const handleEditProduct = useCallback(
    (id) => {
      navigate(`/products/${id}/edit`);
    },
    [navigate]
  );

  const handleOpenDeleteModal = useCallback((product) => {
    setDeleteProductTarget(product);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    if (!isDeleting) {
      setDeleteProductTarget(null);
    }
  }, [isDeleting]);

  const toast = useToast();

  const handleConfirmDelete = async () => {
    if (!deleteProductTarget || isDeleting) return;

    const targetTitle = deleteProductTarget.title;

    try {
      setIsDeleting(true);
      await productService.deleteProduct(deleteProductTarget.id);

      // Local State Update for current SPA session
      setProducts((prev) =>
        prev.filter((item) => item.id !== deleteProductTarget.id)
      );
      setTotal((prev) => Math.max(0, prev - 1));

      toast.success(
        `Product "${targetTitle}" was removed successfully.`,
        'Product Deleted'
      );

      // Close modal
      setDeleteProductTarget(null);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to delete product. Please try again.';
      toast.error(msg, 'Delete Error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-page-header">
        <div className="products-page-title-group">
          <h2 className="products-page-title">Products Inventory</h2>
          <p className="products-page-subtitle">
            Manage your store catalog, check stock levels, and update listings
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/products/new')}
          className="products-page-add-btn"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Unified Filters Bar */}
      <ProductFilters
        search={searchInput}
        category={categoryParam}
        sort={sortParam}
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content Area: Loading, Error, Empty, or Table/Cards */}
      {loading ? (
        <Loading message="Fetching products from inventory..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products match your criteria"
          message="Try searching for a different keyword or removing category and sort filters."
          actionText="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="products-desktop-view">
            <ProductTable
              products={products}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleOpenDeleteModal}
            />
          </div>

          {/* Mobile Card View */}
          <div className="products-mobile-view">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleViewProduct}
                onEdit={handleEditProduct}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>

          {/* Reusable Pagination */}
          <Pagination
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {/* Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteProductTarget)}
        title="Delete Product"
        message={
          deleteProductTarget
            ? `Are you sure you want to delete "${deleteProductTarget.title}"? This simulated action will remove the item from your current session.`
            : ''
        }
        confirmText="Yes, Delete Product"
        confirmVariant="danger"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
}
