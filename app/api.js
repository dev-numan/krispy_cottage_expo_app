import axios from "axios";

// ✅ Updated Base URL
const BASE_URL = "https://sdelectronics.krispycottage.com";

// Axios instance with default baseURL
const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Updated Auth Token
const AUTH_TOKEN = "66810c9f2497e0b72879f6f40";

// Function to fetch categories
export async function fetchCategories() {
  try {
    const response = await api.get("/mobile/category", {
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function fetchProductsBySlug(category_slug) {
  try {
    const response = await api.get(`/mobile/category/${category_slug}`, {
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${category_slug}:`, error);
    throw error;
  }
}

export async function addToCart(payload) {
  try {
    const response = await api.post(`/cart`, payload, {
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error adding to cart:`, error);
    throw error;
  }
}

export async function deleteFromCart(payload) {
  try {
    const response = await api.delete(`/cart/delete`, {
      data: payload,
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error removing item from cart:`, error);
    throw error;
  }
}

export async function getCart() {
  try {
    const response = await api.get(`/mobile/cart`, {
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });
    console.log("Cart response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching cart data:", error);
    throw error;
  }
}

export async function updateCart(payload) {
  try {
    const response = await api.post("/cart/update", payload, {
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error updating cart:`, error);
    throw error;
  }
}

export async function searchProducts(searchquery, page = 1) {
  try {
    const response = await api.get("/mobile/search", {
      params: { searchquery, page },
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
}

export async function fetchProductDetails(productId, customerId = null) {
  try {
    const response = await api.get(`/mobile/product/${productId}`, {
      params: { customerId },
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch product details:", response);
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
}

export async function fetchCheckoutDetails() {
  try {
    const response = await api.get("/mobile/checkout", {
      withCredentials: true,
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch checkout details:", response);
      throw new Error(
        response.data?.message || "Failed to fetch checkout details"
      );
    }
  } catch (error) {
    console.error("Error fetching checkout details:", error);
    throw error;
  }
}

export async function checkout(payload) {
  try {
    console.log("Checkout payload:", payload);
    const response = await api.post("/mobile/placeOrderWithoutDispatching", payload, {
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });
    console.log("Checkout response:", response);
    return response;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
}

export async function getLatestProducts() {
  try {
    const response = await api.get(`/mobile/latestProducts`, {
      headers: {
        "x-auth-token": AUTH_TOKEN,
      },
    });
    console.log("Latest products response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching latest products:", error);
    throw error;
  }
}

export default {
  fetchCategories,
  fetchProductsBySlug,
  addToCart,
  getCart,
  deleteFromCart,
  updateCart,
  searchProducts,
  fetchProductDetails,
  fetchCheckoutDetails,
  checkout,
  getLatestProducts
};
