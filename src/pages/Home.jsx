import { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(function () {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
      } catch {
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // console.log(products);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home">
      <h2>Welcome to E-Store</h2>
      <div className="product-grid">
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
