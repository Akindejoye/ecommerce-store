import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getCategories,
  updateCategory,
  createCategory,
  deleteCategory,
} from "../api/api";
import "../styles/adminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
  const [isFormVisible, setIsFormVisible] = useState(false); // CHANGED: Track form visibility
  const [isCategoryPanelVisible, setIsCategoryPanelVisible] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    id: null,
    name: "",
  });
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  // Fetch all products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productData);
        setCategories(categoryData);
        setLoading(false);
      } catch {
        setError("Failed to fetch data");
        setLoading(false);
        navigate("/error", {
          replace: true,
          state: { message: "Failed to fetch data." },
        });
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (isFormVisible) {
      const timer = setTimeout(() => {
        document.querySelector(".product-form-panel")?.classList.add("active");
      }, 10);
      return () => clearTimeout(timer);
    } else {
      document.querySelector(".product-form-panel")?.classList.remove("active");
    }
  }, [isFormVisible]);

  useEffect(() => {
    if (isCategoryPanelVisible) {
      const timer = setTimeout(() => {
        document.querySelector(".category-form-panel")?.classList.add("active");
      }, 10);
      return () => clearTimeout(timer);
    } else {
      document
        .querySelector(".category-form-panel")
        ?.classList.remove("active");
    }
  }, [isCategoryPanelVisible]);

  // Handle form input changes
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
      setIsFormVisible(false); // CHANGED: Hide form after submission
      setError(null);
      // Refresh products
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch {
      setError("Failed to save product");
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
    setIsFormVisible(true); // CHANGED: Show form for editing
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      try {
        await deleteProduct(id);
        setProducts(products.filter((product) => product.id !== id));
        setLoading(false);
      } catch {
        setError("Failed to delete product");
        setLoading(false);
        navigate("/error", {
          replace: true,
          state: { message: "Failed to delete product." },
        });
      }
    }
  };

  // CHANGED: Toggle form visibility for adding new product
  const handleAddProduct = () => {
    setFormData({
      id: null,
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
    });
    setIsEditing(false);
    setIsFormVisible(true);
  };

  // CHANGED: Close form
  const handleCloseForm = () => {
    setFormData({
      id: null,
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
    });
    setIsEditing(false);
    setIsFormVisible(false);
    setError(null);
  };

  const handleCategoryChange = (e) => {
    setCategoryFormData({ ...categoryFormData, name: e.target.value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name) {
      setError("Category name is required");
      return;
    }
    setLoading(true);
    try {
      if (isEditingCategory) {
        await updateCategory(categoryFormData.id, {
          name: categoryFormData.name,
        });
      } else {
        await createCategory({ name: categoryFormData.name });
      }
      setCategoryFormData({ id: null, name: "" });
      setIsEditingCategory(false);
      setIsCategoryPanelVisible(false);
      setError(null);
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    } catch {
      setError("Failed to save category");
      setLoading(false);
      navigate("/error", {
        replace: true,
        state: { message: "Failed to save category." },
      });
    }
  };

  const handleEditCategory = (category) => {
    setCategoryFormData({ id: category.id, name: category.name });
    setIsEditingCategory(true);
    setIsCategoryPanelVisible(true);
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? Product with this category may be affected."
      )
    ) {
      setLoading(true);
      try {
        await deleteCategory(id);
        setCategories(categories.filter((category) => category.id !== id));
        setLoading(false);
      } catch {
        setError("Failed to delete catgory");
        setLoading(false);
        navigate("/error", {
          replace: true,
          state: { message: "Failed to delete category." },
        });
      }
    }
  };

  const handleManageCategories = () => {
    setCategoryFormData({ id: null, name: "" });
    setIsEditingCategory(false);
    setIsCategoryPanelVisible(true);
  };

  const handleCloseCategoryForm = () => {
    setCategoryFormData({ id: null, name: "" });
    setIsEditingCategory(false);
    setIsCategoryPanelVisible(false);
    setError(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>
      <div className="admin-actions">
        <button className="add-product-button" onClick={handleAddProduct}>
          Add New Product
        </button>
        <button
          className="manage-categories-button"
          onClick={handleManageCategories}>
          Manage Categories
        </button>
      </div>
      {isFormVisible && (
        <div
          className={`product-form-panel ${
            isEditing ? "slide-in-right" : "slide-in-left"
          }`}>
          <form className="product-form" onSubmit={handleSubmit}>
            <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
            <button
              type="button"
              className="close-form-button"
              onClick={handleCloseForm}>
              ×
            </button>
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
              Image URL:
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
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Product"
                : "Add Product"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      )}
      {isCategoryPanelVisible && (
        <div className="category-form-panel slide-in-left">
          <form className="category-form" onSubmit={handleCategorySubmit}>
            <h3>{isEditingCategory ? "Edit Category" : "Add New Category"}</h3>
            <button
              type="button"
              className="close-form-button"
              onClick={handleCloseCategoryForm}>
              ×
            </button>
            <label>
              Category Name:
              <input
                type="text"
                name="name"
                value={categoryFormData.name}
                onChange={handleCategoryChange}
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditingCategory
                ? "Update Category"
                : "Add Category"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
          <h3>Categories</h3>
          <div className="category-list">
            {categories.length === 0 ? (
              <p>No categories available.</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="category-item">
                  <span>{category.name}</span>
                  <div className="category-actions">
                    <button onClick={() => handleEditCategory(category)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCategory(category.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <h3>Products</h3>
      <div className="admin-product-list">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="admin-product-item">
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
