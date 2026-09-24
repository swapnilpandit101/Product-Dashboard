import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productService } from '../services/product.service';
import { ProductForm } from '../components/products/ProductForm';
import { Loading } from '../components/common/Loading';
import './CreateProductPage.css';

/**
 * ARCHITECTURAL DECISION: Create Product Page
 * 
 * WHY REUSABLE PRODUCT FORM IS USED:
 * Delegates layout and input validation to the shared ProductForm component.
 * Coordinates category retrieval, simulated POST /products/add API call, and client navigation.
 */
export function CreateProductPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
        console.warn('Failed to load categories:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoadingCategories(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      await productService.addProduct(formData);
      // Client-side SPA navigation back to products inventory
      navigate('/products');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to add product. Please check input values and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="create-product-page">
      <div className="create-product-page-header">
        <button
          type="button"
          onClick={handleCancel}
          className="create-product-page-back-btn"
        >
          <ArrowLeft size={16} />
          <span>Back to Inventory</span>
        </button>
        <h2 className="create-product-page-title">Add New Product</h2>
        <p className="create-product-page-subtitle">
          Create a new catalog item with pricing, inventory quantity, and category details
        </p>
      </div>

      {loadingCategories ? (
        <Loading message="Loading categories..." />
      ) : (
        <ProductForm
          mode="create"
          categories={categories}
          onSubmit={handleCreate}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}
    </div>
  );
}
