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

export const postOrder = async (order) => {
  const response = await axios.post(`${API_URL}/orders`, {
    method: "POST",
    Headers: { "content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    throw new Error("Failed to place order");
  }
  return response.json();
};
