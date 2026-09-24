import api from '../lib/axios';

/**
 * ARCHITECTURAL DECISION: Product Service Layer with Session-Persistent Mutation Cache
 * 
 * WHY THIS SERVICE & CACHE EXISTS:
 * 1. DummyJSON API simulated mutations: DummyJSON returns success payloads for POST /products/add,
 *    PUT /products/:id, and DELETE /products/:id, but does NOT persist them in its remote database.
 * 2. Client-Side Persistence: To provide a seamless, realistic SPA experience, we maintain a
 *    sessionStorage-backed store of added, updated, and deleted products.
 * 3. All service endpoints (getProducts, searchProducts, getProductsByCategory, getProductById)
 *    transparently reconcile remote API responses with local mutations (merging additions,
 *    applying updates, filtering deletions, and recalculating totals).
 */

const STORAGE_KEYS = {
  ADDED: 'app_mutated_added_products',
  UPDATED: 'app_mutated_updated_products',
  DELETED: 'app_mutated_deleted_ids',
};

function getStoredAdded() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.ADDED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredAdded(items) {
  try {
    sessionStorage.setItem(STORAGE_KEYS.ADDED, JSON.stringify(items));
  } catch {
    // sessionStorage quota exceeded or disabled
  }
}

function getStoredUpdated() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.UPDATED);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredUpdated(map) {
  try {
    sessionStorage.setItem(STORAGE_KEYS.UPDATED, JSON.stringify(map));
  } catch {
    // sessionStorage quota exceeded or disabled
  }
}

function getStoredDeleted() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.DELETED);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveStoredDeleted(set) {
  try {
    sessionStorage.setItem(STORAGE_KEYS.DELETED, JSON.stringify(Array.from(set)));
  } catch {
    // sessionStorage quota exceeded or disabled
  }
}

/**
 * Helper to sort items based on sortBy and order
 */
function sortItems(items, sortBy, order = 'asc') {
  if (!sortBy) return items;
  return [...items].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return order === 'desc' ? 1 : -1;
    if (valA > valB) return order === 'desc' ? -1 : 1;
    return 0;
  });
}

/**
 * Reconcile a list of API products with local added, updated, and deleted items
 */
function reconcileProductList(apiProducts, apiTotal, { added = [], updated = {}, deleted = new Set(), limit = 10, skip = 0, sortBy, order }) {
  // 1. Filter out deleted products from API response & apply updates
  const validApiProducts = apiProducts
    .filter((p) => !deleted.has(String(p.id)) && !deleted.has(Number(p.id)))
    .map((p) => {
      const key = String(p.id);
      return updated[key] ? { ...p, ...updated[key] } : p;
    });

  // 2. Filter out deleted from added list & apply updates
  const validAdded = added
    .filter((p) => !deleted.has(String(p.id)) && !deleted.has(Number(p.id)))
    .map((p) => {
      const key = String(p.id);
      return updated[key] ? { ...p, ...updated[key] } : p;
    });

  // Count deleted items that belonged to the original API database
  const deletedCount = Array.from(deleted).filter((id) => Number(id) <= 194).length;
  const newTotal = Math.max(0, apiTotal + validAdded.length - deletedCount);

  // If on first page (skip === 0), prepend local added products so user sees their new product immediately
  let combined;
  if (skip === 0) {
    combined = [...validAdded, ...validApiProducts];
  } else {
    // Offset for subsequent pages
    combined = [...validApiProducts];
  }

  // Deduplicate by ID just in case
  const seenIds = new Set();
  const deduped = [];
  for (const item of combined) {
    if (!seenIds.has(String(item.id))) {
      seenIds.add(String(item.id));
      deduped.push(item);
    }
  }

  const sorted = sortItems(deduped, sortBy, order);
  const pageSlice = sorted.slice(0, limit);

  return {
    products: pageSlice,
    total: newTotal,
    skip,
    limit,
  };
}

export const productService = {
  /**
   * Fetch paginated list of products with optional sorting
   */
  async getProducts({ limit = 10, skip = 0, sortBy, order, signal } = {}) {
    const params = { limit, skip };
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || 'asc';
    }

    const response = await api.get('/products', { params, signal });
    const added = getStoredAdded();
    const updated = getStoredUpdated();
    const deleted = getStoredDeleted();

    return reconcileProductList(response.data.products || [], response.data.total || 0, {
      added,
      updated,
      deleted,
      limit,
      skip,
      sortBy,
      order,
    });
  },

  /**
   * Search products by text query with support for AbortController signals
   */
  async searchProducts({ q, limit = 10, skip = 0, sortBy, order, signal } = {}) {
    const params = { q, limit, skip };
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || 'asc';
    }

    const response = await api.get('/products/search', { params, signal });
    const added = getStoredAdded();
    const updated = getStoredUpdated();
    const deleted = getStoredDeleted();

    const query = (q || '').trim().toLowerCase();

    const matchesQuery = (item) => {
      if (!item) return false;
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const brand = (item.brand || '').toLowerCase();
      return (
        title.includes(query) ||
        desc.includes(query) ||
        cat.includes(query) ||
        brand.includes(query)
      );
    };

    // 1. Locally added products matching the search query
    const matchingAdded = added.filter(
      (p) =>
        !deleted.has(String(p.id)) &&
        !deleted.has(Number(p.id)) &&
        matchesQuery(p)
    );

    // 2. Locally updated products matching query (that are not in added)
    const matchingUpdated = Object.values(updated).filter(
      (p) =>
        p &&
        p.id &&
        !deleted.has(String(p.id)) &&
        !deleted.has(Number(p.id)) &&
        !added.some((a) => String(a.id) === String(p.id)) &&
        matchesQuery(p)
    );

    // 3. API search results with updates applied, excluding deleted and mismatching items
    const validApi = (response.data.products || [])
      .filter((p) => !deleted.has(String(p.id)) && !deleted.has(Number(p.id)))
      .map((p) => {
        const key = String(p.id);
        return updated[key] ? { ...p, ...updated[key] } : p;
      })
      .filter((p) => matchesQuery(p));

    // 4. Combine all matching results (Added first, then Updated, then API)
    const combined = [...matchingAdded, ...matchingUpdated, ...validApi];
    const seenIds = new Set();
    const deduped = [];
    for (const item of combined) {
      if (!seenIds.has(String(item.id))) {
        seenIds.add(String(item.id));
        deduped.push(item);
      }
    }

    const sorted = sortItems(deduped, sortBy, order);
    const totalCount = Math.max(
      deduped.length,
      response.data.total
        ? response.data.total + matchingAdded.length
        : deduped.length
    );

    return {
      products: sorted.slice(0, limit),
      total: totalCount,
      skip,
      limit,
    };
  },

  /**
   * Fetch all category slugs and names
   */
  async getCategories() {
    const response = await api.get('/products/categories');
    return response.data;
  },

  /**
   * Fetch products filtered by specific category slug
   */
  async getProductsByCategory({ category, limit = 10, skip = 0, sortBy, order, signal } = {}) {
    const params = { limit, skip };
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || 'asc';
    }

    const response = await api.get(`/products/category/${encodeURIComponent(category)}`, {
      params,
      signal,
    });

    const added = getStoredAdded();
    const updated = getStoredUpdated();
    const deleted = getStoredDeleted();

    const matchesCategory = (item) =>
      item &&
      (item.category || '').toLowerCase() === (category || '').toLowerCase();

    // 1. Added products matching this category
    const matchingAdded = added.filter(
      (p) =>
        !deleted.has(String(p.id)) &&
        !deleted.has(Number(p.id)) &&
        matchesCategory(p)
    );

    // 2. Updated products matching this category
    const matchingUpdated = Object.values(updated).filter(
      (p) =>
        p &&
        p.id &&
        !deleted.has(String(p.id)) &&
        !deleted.has(Number(p.id)) &&
        !added.some((a) => String(a.id) === String(p.id)) &&
        matchesCategory(p)
    );

    // 3. API category items with updates applied
    const validApi = (response.data.products || [])
      .filter((p) => !deleted.has(String(p.id)) && !deleted.has(Number(p.id)))
      .map((p) => {
        const key = String(p.id);
        return updated[key] ? { ...p, ...updated[key] } : p;
      })
      .filter((p) => matchesCategory(p));

    const combined = [...matchingAdded, ...matchingUpdated, ...validApi];
    const seenIds = new Set();
    const deduped = [];
    for (const item of combined) {
      if (!seenIds.has(String(item.id))) {
        seenIds.add(String(item.id));
        deduped.push(item);
      }
    }

    const sorted = sortItems(deduped, sortBy, order);
    const totalCount = Math.max(
      deduped.length,
      response.data.total
        ? response.data.total + matchingAdded.length
        : deduped.length
    );

    return {
      products: sorted.slice(0, limit),
      total: totalCount,
      skip,
      limit,
    };
  },

  /**
   * Fetch single product details by ID
   */
  async getProductById(id, { signal } = {}) {
    const deleted = getStoredDeleted();
    if (deleted.has(String(id)) || deleted.has(Number(id))) {
      const err = new Error('Product not found or has been deleted');
      err.response = { data: { message: `Product #${id} has been deleted.` }, status: 404 };
      throw err;
    }

    const added = getStoredAdded();
    const foundAdded = added.find((p) => String(p.id) === String(id));

    const updated = getStoredUpdated();
    const localUpdate = updated[String(id)];

    if (foundAdded) {
      return localUpdate ? { ...foundAdded, ...localUpdate } : foundAdded;
    }

    const response = await api.get(`/products/${id}`, { signal });
    return localUpdate ? { ...response.data, ...localUpdate } : response.data;
  },

  /**
   * Simulate adding a new product (POST /products/add)
   */
  async addProduct(productData) {
    const response = await api.post('/products/add', productData);
    
    // Generate a unique client ID
    const added = getStoredAdded();
    const nextId = response.data?.id
      ? added.some((p) => p.id === response.data.id)
        ? Date.now()
        : response.data.id
      : Date.now();

    const newProduct = {
      id: nextId,
      ...productData,
      rating: 5.0,
      reviews: [],
      thumbnail:
        productData.thumbnail ||
        `https://dummyjson.com/image/400x300/282828/ff5722?text=${encodeURIComponent(
          productData.title || 'Product'
        )}`,
      images: productData.images || [
        `https://dummyjson.com/image/600x400/282828/ff5722?text=${encodeURIComponent(
          productData.title || 'Product'
        )}`,
      ],
    };

    // Save to session additions list (at the top)
    saveStoredAdded([newProduct, ...added]);

    return newProduct;
  },

  /**
   * Simulate updating an existing product (PUT /products/:id)
   */
  async updateProduct(id, productData) {
    let apiResponseData = {};
    try {
      // Only call API if it was an original DummyJSON ID
      if (Number(id) <= 194) {
        const response = await api.put(`/products/${id}`, productData);
        apiResponseData = response.data || {};
      }
    } catch {
      // Fallback for custom or local items
    }

    const stringId = String(id);
    const added = getStoredAdded();
    const isAdded = added.some((p) => String(p.id) === stringId);

    if (isAdded) {
      const updatedAdded = added.map((p) =>
        String(p.id) === stringId ? { ...p, ...productData } : p
      );
      saveStoredAdded(updatedAdded);
    } else {
      const updatedMap = getStoredUpdated();
      const existingUpdated = updatedMap[stringId] || {};
      updatedMap[stringId] = {
        id: Number(id) || id,
        ...existingUpdated,
        ...apiResponseData,
        ...productData,
      };
      saveStoredUpdated(updatedMap);
    }

    return {
      id: Number(id) || id,
      ...apiResponseData,
      ...productData,
    };
  },

  /**
   * Simulate deleting a product (DELETE /products/:id)
   */
  async deleteProduct(id) {
    try {
      if (Number(id) <= 194) {
        await api.delete(`/products/${id}`);
      }
    } catch {
      // Ignore API simulation failure on local items
    }

    const stringId = String(id);
    const deleted = getStoredDeleted();
    deleted.add(stringId);
    deleted.add(Number(id));
    saveStoredDeleted(deleted);

    // If it was in added items, remove it from added
    const added = getStoredAdded();
    const filteredAdded = added.filter((p) => String(p.id) !== stringId);
    saveStoredAdded(filteredAdded);

    // If it was in updated items, clean up
    const updated = getStoredUpdated();
    delete updated[stringId];
    saveStoredUpdated(updated);

    return { isDeleted: true, id };
  },
};

