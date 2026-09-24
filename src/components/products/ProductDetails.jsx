import { useState } from 'react';
import { ArrowLeft, Pencil, Trash2, Star, ShieldCheck, Truck } from 'lucide-react';
import './ProductDetails.css';

/**
 * ARCHITECTURAL DECISION: Product Details Presentation Component
 * 
 * WHY RICH PRESENTATION COMPONENT:
 * Renders complete product specifications, interactive thumbnail gallery, inventory metrics,
 * and user reviews provided by DummyJSON (`GET /products/:id`).
 */
export function ProductDetails({
  product,
  onEdit,
  onDelete,
  onBack,
}) {
  const [selectedImage, setSelectedImage] = useState(() => {
    return product.images?.[0] || product.thumbnail || '';
  });

  const images = product.images && product.images.length > 0
    ? product.images
    : product.thumbnail
    ? [product.thumbnail]
    : [];

  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-details">
      {/* Top Action Bar */}
      <div className="product-details-top-bar">
        <button
          type="button"
          onClick={onBack}
          className="product-details-btn-back"
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>

        <div className="product-details-actions">
          <button
            type="button"
            onClick={() => onEdit(product.id)}
            className="product-details-btn product-details-btn-edit"
          >
            <Pencil size={14} />
            <span>Edit Product</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="product-details-btn product-details-btn-delete"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Specs */}
      <div className="product-details-grid">
        {/* Left Column: Image Gallery */}
        <div className="product-details-gallery">
          <div className="product-details-main-image-wrapper">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.title}
                className="product-details-main-image"
              />
            ) : (
              <div className="product-details-no-image">No Image Available</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="product-details-thumbnails">
              {images.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`product-details-thumb-btn ${
                    selectedImage === imgUrl ? 'product-details-thumb-active' : ''
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.title} view ${index + 1}`}
                    className="product-details-thumb-img"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Metrics */}
        <div className="product-details-info">
          <div className="product-details-meta-header">
            <span className="product-details-category-badge">
              {product.category}
            </span>
            <span className="product-details-sku">
              SKU: {product.sku || `PRD-${product.id}`}
            </span>
          </div>

          <h2 className="product-details-title">{product.title}</h2>
          {product.brand && (
            <div className="product-details-brand">By {product.brand}</div>
          )}

          <div className="product-details-price-row">
            <div className="product-details-price">
              ${Number(product.price).toFixed(2)}
            </div>
            {product.discountPercentage > 0 && (
              <span className="product-details-discount-badge">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          <p className="product-details-description">{product.description}</p>

          {/* Quick Metrics Grid */}
          <div className="product-details-metrics-grid">
            <div className="product-details-metric-card">
              <span className="product-details-metric-label">Rating</span>
              <div className="product-details-metric-rating-val">
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span>{Number(product.rating).toFixed(1)} / 5.0</span>
              </div>
            </div>

            <div className="product-details-metric-card">
              <span className="product-details-metric-label">Stock Status</span>
              <span
                className={`product-details-metric-val ${
                  isOutOfStock
                    ? 'product-details-stock-out'
                    : isLowStock
                    ? 'product-details-stock-low'
                    : 'product-details-stock-ok'
                }`}
              >
                {product.stock} units
              </span>
            </div>

            <div className="product-details-metric-card">
              <span className="product-details-metric-label">Warranty</span>
              <div className="product-details-metric-feature">
                <ShieldCheck size={14} className="product-details-metric-icon" />
                <span className="product-details-metric-val">
                  {product.warrantyInformation || 'Standard warranty'}
                </span>
              </div>
            </div>

            <div className="product-details-metric-card">
              <span className="product-details-metric-label">Shipping</span>
              <div className="product-details-metric-feature">
                <Truck size={14} className="product-details-metric-icon" />
                <span className="product-details-metric-val">
                  {product.shippingInformation || 'Standard delivery'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="product-details-reviews-section">
          <h3 className="product-details-reviews-title">
            Customer Reviews ({product.reviews.length})
          </h3>

          <div className="product-details-reviews-list">
            {product.reviews.map((review, index) => (
              <div key={index} className="product-details-review-card">
                <div className="product-details-review-header">
                  <span className="product-details-reviewer-name">
                    {review.reviewerName}
                  </span>
                  <div className="product-details-review-rating">
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <span>{review.rating} / 5</span>
                  </div>
                </div>
                <p className="product-details-review-comment">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <span className="product-details-review-date">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
