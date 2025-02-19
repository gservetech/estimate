const BASE_URL = "http://165.227.42.159:8080/api";

/**
 * Fetch all products
 */
export const getAllProducts = async () => {
  return fetchData("/products", "Error fetching all products");
};

/**
 * Fetch all categories
 */
export const getAllCategories = async () => {
  return fetchData("/categories", "Error fetching all categories");
};

/**
 * Fetch active sale by coupon code
 * @param couponCode - Coupon code to search for active sales
 */
export const getActiveSaleByCouponCode = async (couponCode: string) => {
  return fetchData(`/sales/active?couponCode=${couponCode}`, "Error fetching active sale by coupon code");
};

/**
 * Search products by name
 * @param searchParam - Product name to search
 */
export const searchProductsByName = async (searchParam: string) => {
  return fetchData(`/products/search?name=${searchParam}`, "Error fetching products by name");
};

/**
 * Fetch product details by slug
 * @param slug - Product slug identifier
 */
export const getProductBySlug = async (slug: string) => {
  return fetchData(`/products/${slug}`, "Error fetching product by slug");
};

/**
 * Fetch products by category
 * @param categorySlug - Category slug identifier
 */
export const getProductsByCategory = async (categorySlug: string) => {
  return fetchData(`/products/category/${categorySlug}`, "Error fetching products by category");
};

/**
 * Fetch all sales
 */
export const getSale = async () => {
  return fetchData("/sales", "Error fetching sales");
};

/**
 * Fetch user orders
 * @param userId - User ID to fetch orders for
 */
export const getMyOrders = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  return fetchData(`/orders/user/${userId}`, "Error fetching user orders");
};

/**
 * Generic function to fetch data with error handling
 * @param endpoint - The API endpoint to fetch from
 * @param errorMessage - Error message to log
 */
const fetchData = async (endpoint: string, errorMessage: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return null;
  }
};
