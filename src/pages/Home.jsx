import { useCallback, useEffect, useState } from "react";
import { getProductsByQuery } from "../api/api";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Fetch Products
  const fetchProducts = useCallback(async (query, cat) => {
    setLoading(true);
    try {
      const data = await getProductsByQuery(query, cat);
      console.log("Fetched products", data); // Debug
      setProducts(data);
      setLoading(false);
    } catch {
      console.error("Fetch error:", error); // Debug
      setError("Failed to fetch products");
      setLoading(false);
    }
  }, []);

  // Debounce fetch
  const debouncedFetch = useCallback(debounce(fetchProducts, 1000), [
    fetchProducts,
  ]);

  // Initial fetch
  useEffect(
    function () {
      fetchProducts("", "All");
    },
    [fetchProducts]
  );

  // Handle search and category change
  useEffect(() => {
    debouncedFetch(searchQuery, category);
  }, [searchQuery, category, debouncedFetch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (products.length === 0) return <div>No products found</div>;

  return (
    <div className="home">
      <h2>Products</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Books">Books</option>
          <option value="Electronics">Electronics</option>
          <option value="Appliances">Appliances</option>
        </select>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="link">
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
