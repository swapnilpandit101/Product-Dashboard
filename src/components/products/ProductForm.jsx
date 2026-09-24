import { useState, useEffect } from 'react';
import { validateProductForm } from '../../utils/validation';
import { useToast } from '../../context/ToastContext';
import './ProductForm.css';

/**
 * ARCHITECTURAL DECISION: Reusable Product Form Component
 * 
 * WHY A SINGLE REUSABLE FORM FOR CREATE & EDIT:
 * 1. Single Source of Truth: Product schema, input fields, and validation logic are defined once.
 * 2. Mode-Driven Behavior: Adapts button labels, titles, and submission handlers based on `mode` ('create' | 'edit').
 * 3. Duplicate Request Protection: Locks the submit button with `isSubmitting` state during active API calls.
 * 4. UX Accessibility: Automatically shows top toast notifications on validation failure and smoothly scrolls to
 *    the topmost unfilled mandatory field.
 */
export function ProductForm({
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = '',
}) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    discountPercentage: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '',
        brand: initialData.brand || '',
        discountPercentage:
          initialData.discountPercentage !== undefined
            ? String(initialData.discountPercentage)
            : '',
      });
    }
  }, [initialData]);

  // Show API error via toast when passed
  useEffect(() => {
    if (error) {
      toast.error(error, 'Submission Failed');
    }
  }, [error, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      
      // Trigger Top Toast Message
      toast.error(
        'Please fill up all mandatory fields.',
        'Required Fields Missing'
      );

      // Smoothly scroll to the topmost unfilled mandatory field
      const fieldOrder = ['title', 'description', 'category', 'price', 'stock'];
      const firstInvalidField = fieldOrder.find((field) => validation.errors[field]);
      
      if (firstInvalidField) {
        setTimeout(() => {
          const element =
            document.getElementById(`product-${firstInvalidField}`) ||
            document.querySelector(`[name="${firstInvalidField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus({ preventScroll: true });
          }
        }, 50);
      }
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      brand: formData.brand.trim() || undefined,
      discountPercentage: formData.discountPercentage
        ? Number(formData.discountPercentage)
        : 0,
    };

    onSubmit(payload);
  };

  const isEditMode = mode === 'edit';
  const submitText = isSubmitting
    ? isEditMode
      ? 'Saving Changes...'
      : 'Adding Product...'
    : isEditMode
    ? 'Update Product'
    : 'Create Product';

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="product-form-error-banner" role="alert">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="product-form-section">
        <h3 className="product-form-section-title">General Information</h3>

        <div className="product-form-grid">
          <div className="product-form-group product-form-col-full">
            <label htmlFor="product-title" className="product-form-label">
              Product Title <span className="product-form-required">*</span>
            </label>
            <input
              id="product-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`product-form-input ${
                validationErrors.title ? 'product-form-input-error' : ''
              }`}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
            />
            {validationErrors.title && (
              <span className="product-form-error-text">
                {validationErrors.title}
              </span>
            )}
          </div>

          <div className="product-form-group product-form-col-full">
            <label htmlFor="product-description" className="product-form-label">
              Description <span className="product-form-required">*</span>
            </label>
            <textarea
              id="product-description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`product-form-textarea ${
                validationErrors.description ? 'product-form-textarea-error' : ''
              }`}
              placeholder="Provide full specifications and product highlights..."
            />
            {validationErrors.description && (
              <span className="product-form-error-text">
                {validationErrors.description}
              </span>
            )}
          </div>

          <div className="product-form-group">
            <label htmlFor="product-category" className="product-form-label">
              Category <span className="product-form-required">*</span>
            </label>
            <select
              id="product-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`product-form-select ${
                validationErrors.category ? 'product-form-select-error' : ''
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => {
                const slug = typeof cat === 'string' ? cat : cat.slug;
                const name = typeof cat === 'string' ? cat : cat.name;
                return (
                  <option key={slug} value={slug}>
                    {name}
                  </option>
                );
              })}
            </select>
            {validationErrors.category && (
              <span className="product-form-error-text">
                {validationErrors.category}
              </span>
            )}
          </div>

          <div className="product-form-group">
            <label htmlFor="product-brand" className="product-form-label">
              Brand / Manufacturer
            </label>
            <input
              id="product-brand"
              name="brand"
              type="text"
              value={formData.brand}
              onChange={handleChange}
              disabled={isSubmitting}
              className="product-form-input"
              placeholder="e.g. Sony, Apple, Samsung"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="product-form-section">
        <h3 className="product-form-section-title">Pricing & Inventory</h3>

        <div className="product-form-grid">
          <div className="product-form-group">
            <label htmlFor="product-price" className="product-form-label">
              Price (USD) <span className="product-form-required">*</span>
            </label>
            <input
              id="product-price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`product-form-input ${
                validationErrors.price ? 'product-form-input-error' : ''
              }`}
              placeholder="0.00"
            />
            {validationErrors.price && (
              <span className="product-form-error-text">
                {validationErrors.price}
              </span>
            )}
          </div>

          <div className="product-form-group">
            <label htmlFor="product-stock" className="product-form-label">
              Stock Quantity <span className="product-form-required">*</span>
            </label>
            <input
              id="product-stock"
              name="stock"
              type="number"
              step="1"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`product-form-input ${
                validationErrors.stock ? 'product-form-input-error' : ''
              }`}
              placeholder="0"
            />
            {validationErrors.stock && (
              <span className="product-form-error-text">
                {validationErrors.stock}
              </span>
            )}
          </div>

          <div className="product-form-group">
            <label htmlFor="product-discount" className="product-form-label">
              Discount Percentage (%)
            </label>
            <input
              id="product-discount"
              name="discountPercentage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.discountPercentage}
              onChange={handleChange}
              disabled={isSubmitting}
              className="product-form-input"
              placeholder="0.0"
            />
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="product-form-footer">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="product-form-btn product-form-btn-cancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="product-form-btn product-form-btn-submit"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
