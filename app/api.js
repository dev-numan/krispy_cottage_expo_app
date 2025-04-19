import axios from "axios";

// Base URL for your API (change accordingly)
// const BASE_URL = "https://4a4c-39-49-90-100.ngrok-free.app";
const BASE_URL = "https://krispycottage.com";

// Axios instance with default baseURL
const api = axios.create({
  baseURL: BASE_URL,
});

// Function to fetch categories
export async function fetchCategories() {
  try {
    const response = await api.get("/mobile/category", {
      headers: {
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2",
      },
    });

    return response.data; // Return the data received from the API
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // You can throw the error or handle it as needed
  }
}

export async function fetchProductsBySlug(category_slug) {
  try {
    const response = await api.get(`/mobile/category/${category_slug}`, {
      headers: {
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2", // Your authorization token
      },
    });

    return response.data; // Return the data received from the API
  } catch (error) {
    console.error(`Error fetching category ${category_slug}:`, error);
    throw error; // You can throw the error or handle it as needed
  }
}

export async function addToCart(payload) {
  try {
    const response = await api.post(`/cart`, payload, {
      headers: {
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2",
      },
    });

    return response;
  } catch (error) {
    console.error(`Error adding to cart in category ${category_slug}:`, error);
    throw error;
  }
}

export async function deleteFromCart(payload) {
  try {
    const response = await api.delete(`/cart/delete`, {
      data: payload,
      headers: {
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2",
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
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2",
      },
    });
    console.log("dddddd", response);
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
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2", // Include your auth token here
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
      params: {
        searchquery,
        page,
      },
      headers: {
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2", // Include your auth token here
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
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2",
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
      withCredentials: true, // Ensures cookies like "cart" are sent
      headers: {
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2", // Replace with real store/user token
      },
    });

    if (response.status === 200) {
      return response.data; // Contains: products, subtotal, shipping, total
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

    console.log("payload", payload);
    const response = await api.post("/mobile/placeOrderWithoutDispatching", payload, {
      headers: {
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2", // Same auth header pattern
      },
    });
console.log("responseee", response);
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
        "x-auth-token": "66862b5e6cfb8b8f9127f6a2",
      },
    });
    console.log("dddddd", response);
    return response;
  } catch (error) {
    console.error("Error fetching cart data:", error);
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
