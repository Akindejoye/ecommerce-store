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

  // Fetch Products
  const fetchProducts = useCallback(async (query, filterType) => {
    setLoading(true);
    try {
      const data = await getProductsByQuery(query, filterType);
      // console.log("Raw API data:", data); // Debug raw data
      let filteredData = data || []; // Ensure data is array
      if (filterType === "search" && query) {
        const lowerQuery = query.toLowerCase();
        filteredData = data.filter(
          (product) =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery)
        );
      }
      // console.log("Fetched products:", filteredData); // Debug
      setProducts(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error); // Debug
      setError("Failed to fetch products");
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(
    function () {
      fetchProducts("", "category");
    },
    [fetchProducts]
  );

  // Handle category
  useEffect(() => {
    setSearchQuery(""); // Reset search when changing category
    fetchProducts(category, "category");
  }, [category, fetchProducts]);

  // Handle search on Enter
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery) {
      setCategory("All"); // Reset category on search
      fetchProducts(searchQuery, "search");
      setSearchQuery(""); // Clear input after search
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (products.length === 0) return <div>No products found</div>;

  return (
    <div className="home">
      <h2>Products</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search products or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
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
