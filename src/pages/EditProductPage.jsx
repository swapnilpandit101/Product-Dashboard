import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productService } from '../services/product.service';
import { ProductForm } from '../components/products/ProductForm';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { useToast } from '../context/ToastContext';
import './EditProductPage.css';

/**
 * ARCHITECTURAL DECISION: Edit Product Page
 * 
 * WHY REUSABLE FORM IS LEVERAGED:
 * Passes existing product metadata (`initialData`) and `mode="edit"` into the shared ProductForm.
 * Coordinates PUT /products/:id update call and client-side SPA navigation.
 */
export function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError('');
      const [productData, categoriesData] = await Promise.all([
        productService.getProductById(id),
        productService.getCategories(),
      ]);
      setProduct(productData);
      setCategories(categoriesData);
    } catch (err) {
      setFetchError(
        err.response?.data?.message ||
          `Failed to load product #${id} details for editing.`
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleUpdate = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      await productService.updateProduct(id, formData);
      toast.success(
        `Product "${formData.title}" was updated successfully!`,
        'Product Updated'
      );
      // Navigate client-side back to products catalog
      navigate('/products');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to update product. Please check input values and try again.';
      setSubmitError(msg);
      toast.error(msg, 'Update Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="edit-product-page">
      <div className="edit-product-page-header">
        <button
          type="button"
          onClick={handleCancel}
          className="edit-product-page-back-btn"
        >
          <ArrowLeft size={16} />
          <span>Back to Inventory</span>
        </button>
        <h2 className="edit-product-page-title">
          Edit Product {product ? `— #${product.id}` : ''}
        </h2>
        <p className="edit-product-page-subtitle">
          Update specifications, change pricing, and modify stock quantities
        </p>
      </div>

      {loading ? (
        <Loading message="Loading product data for editing..." />
      ) : fetchError ? (
        <ErrorState
          title="Could Not Load Product"
          message={fetchError}
          onRetry={loadInitialData}
        />
      ) : product ? (
        <ProductForm
          mode="edit"
          initialData={product}
          categories={categories}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          error={submitError}
        />
      ) : null}
    </div>
  );
}
