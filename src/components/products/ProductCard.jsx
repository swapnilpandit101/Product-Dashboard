import { memo } from 'react';
import { Star, Eye, Pencil, Trash2 } from 'lucide-react';
import './ProductCard.css';

/**
 * ARCHITECTURAL DECISION: Mobile Product Card Component
 * 
 * WHY MOBILE USES CARDS INSTEAD OF COMPRESSED TABLES:
 * Tables on small viewports either trigger horizontal overflow or truncate crucial columns.
 * Rendering discrete card containers on mobile screens provides a touch-friendly, readable,
 * and accessible interface without duplicating business or action logic.
 */
export const ProductCard = memo(function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
}) {
  const thumbnail = product.thumbnail || product.images?.[0] || '';
  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <div className="product-card-top">
        <div className="product-card-image-wrapper">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={product.title}
              className="product-card-image"
              loading="lazy"
            />
          ) : (
            <div className="product-card-no-image">No Img</div>
          )}
        </div>

        <div className="product-card-header-info">
          <span className="product-card-category">{product.category}</span>
          <h3 className="product-card-title">{product.title}</h3>
          <div className="product-card-price-row">
            <span className="product-card-price">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="product-card-discount">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="product-card-meta">
        <div className="product-card-rating">
          <Star size={13} fill="#f59e0b" color="#f59e0b" />
          <span className="product-card-rating-val">
            {Number(product.rating).toFixed(1)}
          </span>
        </div>

        <span
          className={`product-card-stock ${
            isOutOfStock
              ? 'product-card-stock-out'
              : isLowStock
              ? 'product-card-stock-low'
              : 'product-card-stock-ok'
          }`}
        >
          {product.stock} in stock
        </span>
      </div>

      <div className="product-card-actions">
        <button
          type="button"
          onClick={() => onView(product.id)}
          className="product-card-btn product-card-btn-view"
          title="View Details"
          aria-label="View Details"
        >
          <Eye size={16} />
        </button>
        <button
          type="button"
          onClick={() => onEdit(product.id)}
          className="product-card-btn product-card-btn-edit"
          title="Edit Product"
          aria-label="Edit Product"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="product-card-btn product-card-btn-delete"
          title="Delete Product"
          aria-label="Delete Product"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
});
