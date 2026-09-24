import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productService } from '../services/product.service';
import { ProductDetails } from '../components/products/ProductDetails';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmModal } from '../components/common/ConfirmModal';
import './ProductDetailsPage.css';

/**
 * ARCHITECTURAL DECISION: Product Details Page
 * 
 * WHY ISOLATED ROUTE CONTROLLER:
 * Fetches product metadata by ID (/products/:id), handles 404/not-found states gracefully,
 * and coordinates view actions (editing, deletion modal, returning to list).
 */
export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError('');
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Product with ID #${id} was not found or could not be retrieved.`
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/products');
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!product || isDeleting) return;

    try {
      setIsDeleting(true);
      await productService.deleteProduct(product.id);
      setIsDeleteModalOpen(false);
      navigate('/products');
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to delete product. Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="product-details-page">
      {loading ? (
        <Loading message="Loading product specifications..." />
      ) : error ? (
        <div className="product-details-page-error-wrapper">
          <ErrorState
            title="Product Not Found"
            message={error}
            onRetry={fetchProduct}
          />
          <button
            type="button"
            onClick={handleBack}
            className="product-details-page-back-btn"
          >
            <ArrowLeft size={16} />
            <span>Return to Inventory</span>
          </button>
        </div>
      ) : product ? (
        <>
          <ProductDetails
            product={product}
            onEdit={handleEdit}
            onDelete={handleOpenDeleteModal}
            onBack={handleBack}
          />

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            title="Delete Product"
            message={`Are you sure you want to delete "${product.title}"? This will simulate deleting product #${product.id} and return you to the products catalog.`}
            confirmText="Yes, Delete Product"
            confirmVariant="danger"
            isConfirming={isDeleting}
            onConfirm={handleConfirmDelete}
            onClose={handleCloseDeleteModal}
          />
        </>
      ) : null}
    </div>
  );
}
