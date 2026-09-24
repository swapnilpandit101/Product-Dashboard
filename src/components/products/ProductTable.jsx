import { memo } from 'react';
import { Star, Eye, Pencil, Trash2 } from 'lucide-react';
import './ProductTable.css';

/**
 * ARCHITECTURAL DECISION: Desktop Product Table Component
 * 
 * WHY THIS IS A PURE PRESENTATIONAL COMPONENT:
 * 1. Single Responsibility: Only renders product rows and forwards user actions (view, edit, delete).
 * 2. Zero Network Coupling: Does not import Axios, compute pagination, or parse URLs.
 * 3. Memoization: Wrapped in React.memo to prevent unnecessary row re-renders when parent state
 *    updates unrelated to the products array (e.g. mobile drawer toggle).
 */
export const ProductTable = memo(function ProductTable({
  products = [],
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="product-table-wrapper">
      <table className="product-table">
        <thead className="product-table-head">
          <tr>
            <th className="product-table-th product-table-th-image">Image</th>
            <th className="product-table-th product-table-th-title">Title</th>
            <th className="product-table-th product-table-th-category">Category</th>
            <th className="product-table-th product-table-th-price">Price</th>
            <th className="product-table-th product-table-th-rating">Rating</th>
            <th className="product-table-th product-table-th-stock">Stock</th>
            <th className="product-table-th product-table-th-actions">Actions</th>
          </tr>
        </thead>
        <tbody className="product-table-body">
          {products.map((product) => {
            const thumbnail = product.thumbnail || product.images?.[0] || '';
            const isLowStock = product.stock < 10;
            const isOutOfStock = product.stock === 0;

            return (
              <tr key={product.id} className="product-table-row">
                <td className="product-table-td product-table-td-image">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={product.title}
                      className="product-table-thumbnail"
                      loading="lazy"
                    />
                  ) : (
                    <div className="product-table-no-image">No Img</div>
                  )}
                </td>

                <td className="product-table-td product-table-td-title">
                  <div className="product-table-title-text">{product.title}</div>
                  <div className="product-table-brand-text">{product.brand || product.category}</div>
                </td>

                <td className="product-table-td product-table-td-category">
                  <span className="product-table-category-badge">
                    {product.category}
                  </span>
                </td>

                <td className="product-table-td product-table-td-price">
                  <span className="product-table-price-value">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="product-table-discount-badge">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  )}
                </td>

                <td className="product-table-td product-table-td-rating">
                  <div className="product-table-rating-cell">
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <span className="product-table-rating-value">
                      {Number(product.rating).toFixed(1)}
                    </span>
                  </div>
                </td>

                <td className="product-table-td product-table-td-stock">
                  <span
                    className={`product-table-stock-badge ${
                      isOutOfStock
                        ? 'product-table-stock-out'
                        : isLowStock
                        ? 'product-table-stock-low'
                        : 'product-table-stock-ok'
                    }`}
                  >
                    {product.stock} units
                  </span>
                </td>

                <td className="product-table-td product-table-td-actions">
                  <div className="product-table-action-group">
                    <button
                      type="button"
                      onClick={() => onView(product.id)}
                      className="product-table-action-btn product-table-btn-view"
                      title="View Details"
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(product.id)}
                      className="product-table-action-btn product-table-btn-edit"
                      title="Edit Product"
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="product-table-action-btn product-table-btn-delete"
                      title="Delete Product"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
