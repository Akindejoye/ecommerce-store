import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/api";
import "../styles/adminPanel.css";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch products", error);
        setLoading(false);
        navigate("/error", {
          replace: true,
          state: { massage: "Failed to fetch products." },
        });
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      !formData.image ||
      !formData.category
    ) {
      setError("All fields are required");
      return;
    }
    setLoading(true);

    try {
      const product = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        image: formData.image,
        category: formData.category,
      };
      if (isEditing) {
        await updateProduct(formData.id, product);
      } else {
        await createProduct(product);
      }
      setFormData({
        id: null,
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });
      setIsEditing(false);
      setError(null);
      // Refresh products
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to save product", error);
      setLoading(false);
      navigate("/error", {
        replace: true,
        state: { message: "Failed to save product." },
      });
    }
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      category: product.category,
    });
    setIsEditing(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this products")) {
      setLoading(true);
      try {
        await deleteProduct(id);
        setProducts(products.filter((product) => product.id !== id));
        setLoading(false);
      } catch (error) {
        setError("Failed to delete product", error);
        setLoading(false);
        navigate("/error", {
          replace: true,
          state: { message: "Failed to delete product." },
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-panel">
      <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
      <form className="admin-product-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Imaage URL:
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required>
            <option value="">Select Category</option>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Appliances">Appliances</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
        </button>
        {isEditing && (
          <button
            className="cancel-button"
            type="button"
            onClick={() => {
              setFormData({
                id: null,
                name: "",
                price: "",
                description: "",
                image: "",
                category: "",
              });
              setIsEditing(false);
            }}>
            Cancel
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </form>
      <h3>Products</h3>
      <div className="admin-product-list">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div className="admin-product-item" key={product.id}>
              <img
                src={product.image}
                alt={product.name}
                className="admin-product-image"
              />
              <div className="admin-product-details">
                <p>
                  <strong>{product.name}</strong>
                </p>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Description: {product.description}</p>
                <p>Category: {product.category}</p>
              </div>
              <div className="admin-product-actions">
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
