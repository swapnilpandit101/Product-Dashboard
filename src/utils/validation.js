/**
 * ARCHITECTURAL DECISION: Pure Validation Utilities
 * 
 * WHY THIS MODULE EXISTS:
 * Reusable validation logic shared across ProductForm (Create & Edit modes)
 * and AuthForm to ensure consistent error messaging, predictable constraints,
 * and zero duplicated validation code in component JSX.
 */

/**
 * Validate Product Data
 * Constraints:
 * - title: required, non-empty
 * - description: required, non-empty
 * - category: required, non-empty
 * - price: number > 0
 * - stock: integer >= 0
 */
export function validateProductForm(formData) {
  const errors = {};

  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!formData.category || !formData.category.trim()) {
    errors.category = 'Category is required';
  }

  const numericPrice = Number(formData.price);
  if (formData.price === '' || formData.price === null || isNaN(numericPrice) || numericPrice <= 0) {
    errors.price = 'Price must be a positive number greater than 0';
  }

  const numericStock = Number(formData.stock);
  if (formData.stock === '' || formData.stock === null || isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
    errors.stock = 'Stock must be a non-negative whole number (0 or higher)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate Login Form
 */
export function validateLoginForm(formData) {
  const errors = {};

  if (!formData.username || !formData.username.trim()) {
    errors.username = 'Username is required';
  }

  if (!formData.password || !formData.password.trim()) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
