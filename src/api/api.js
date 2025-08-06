import axios from "axios";

const API_URL = "http://localhost:3500";

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const getProductsByQuery = async (query = "", filterType = "All") => {
  const params = {};
  if (filterType === "category" && query && query !== "All") {
    params.category = query; // Exact match for category
    console.log("API query params:", params); // Debug API params
  }
  const response = await axios.get(`${API_URL}/products`, { params });
  console.log("API response data:", response.data); // Debug response
  return response.data;
};

export const postOrder = async (order) => {
  const orderData = { body: JSON.stringify(order) }; // Store as stringified body
  const response = await axios.post(`${API_URL}/orders`, orderData, {
    headers: { "content-Type": "application/json" },
  });
  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Failed to place order");
  }
  return response.data;
};
