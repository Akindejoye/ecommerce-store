import { useCallback, useEffect, useState } from "react";
import { getProductsByQuery } from "../api/api";
import { Link, useSearchParams, useNavigate, Navigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Slider from "../components/slider/Slider";
import "../styles/home.css";
// import { CartContext } from "../context/CartContext";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);

  const navigate = useNavigate();

  // Fetch Products
  const fetchProducts = useCallback(
    async (query, filterType) => {
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
        if (filteredData.length === 0 && filterType === "search") {
          navigate("/error", {
            replace: true,
            state: { message: "No products found for your search." },
          });
        }
      } catch (error) {
        console.error("Fetch error:", error); // Debug
        setError("Failed to fetch products");
        setLoading(false);
        navigate("/error", {
          replace: true,
          state: { message: "Failed to fetch products. Please try again." },
        });
      }
    },
    [navigate]
  );

  // Fetch Suggestion
  const fetchSuggestions = useCallback(
    async (query) => {
      if (!query || isSuggestionClicked) {
        setSuggestions([]);
        return;
      }
      try {
        const data = await getProductsByQuery("", "category");
        const lowerQuery = query.toLowerCase();
        const uniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ];
        const filteredSuggestions = [
          ...data
            .filter((product) =>
              product.name.toLowerCase().includes(lowerQuery)
            )
            .map((product) => product.name),
          ...uniqueCategories.filter((cat) =>
            cat.toLowerCase().includes(lowerQuery)
          ),
        ];
        setSuggestions([...new Set(filteredSuggestions)].slice(0, 5));
      } catch (error) {
        console.error("Suggestion fetch error:", error);
        navigate("/error", {
          replace: true,
          state: { message: "Failed to fetch suggestion. Please try again." },
        });
        setSuggestions([]);
      }
    },
    [isSuggestionClicked, navigate]
  );

  // Initialize from URL params
  useEffect(
    function () {
      const query = searchParams.get("q") || ""; // Read q param
      const cat = searchParams.get("category") || "All"; // Read category param
      if (query !== searchQuery || cat !== category) {
        // Skip if params match state
        setSearchQuery(query);
        setCategory(cat);
        setIsSearching(!!query);
        if (query) {
          fetchProducts(query, "search");
        } else {
          fetchProducts(cat, "category");
        }
      }
    },
    [fetchProducts, searchParams]
  );

  // Handle search query change for suggestions
  useEffect(() => {
    fetchSuggestions(searchQuery);
  }, [searchQuery, fetchSuggestions]);

  // Handle search on Enter
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery) {
      setIsSearching(true);
      setCategory("All"); // Reset category on search
      fetchProducts(searchQuery, "search");
      setSearchParams({ q: searchQuery }, { replace: true }); // Update URL with q param
      setSearchQuery(""); // Clear input after search
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setIsSuggestionClicked(true);
    setSuggestions([]);
    setIsSearching(true);
    setCategory("All");
    fetchProducts(suggestion, "search");
    setSearchParams({ q: suggestion }, { replace: true });
    setSearchQuery("");
  };

  // Reset isSuggestionClicked after updates
  useEffect(() => {
    if (setIsSuggestionClicked) {
      setIsSuggestionClicked(false);
    }
  }, [isSuggestionClicked]);

  // Handle category
  useEffect(() => {
    if (isSearching) {
      return;
    }
    fetchProducts(category, "category");
    setSearchQuery(""); // Reset search when changing category
    setSearchParams(category === "All" ? {} : { category }, { replace: true }); // update URL with category param. Use replace to avoid extra history entry
  }, [category, fetchProducts, isSearching, setSearchParams]);

  // Force input clear after searchParams update
  useEffect(() => {
    if (searchParams.get("q") || searchParams.get("category")) {
      setSearchQuery("");
    }
  }, [searchParams]);

  if (loading) return <div>Loading...</div>;
  if (error) return <Navigate to="/error" replace state={{ message: error }} />;

  const slides = [
    <div>Slide 1 🚀</div>,
    <div>Slide 2 🔥</div>,
    <div>Slide 3 ⭐</div>,
  ];

  return (
    <div className="home">
      <h2>Products</h2>
      <div className="filters">
        <div className="select-box">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setIsSearching(false); // CHANGED: Reset isSearching on category change
            }}>
            <option value="All">All Categories</option>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Appliances">Appliances</option>
          </select>
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="Search products or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item">
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Slider slides={slides} />
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
