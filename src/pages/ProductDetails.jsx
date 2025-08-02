import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/product-details.css";
import { CartContext } from "./../context/CartContext";
import { getProductById } from "../api/api";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(
    function () {
      const fetchProduct = async () => {
        try {
          const data = await getProductById(id);
          setProduct(data);
          setLoading(false);
        } catch (error) {
          setError(`Can't fetch product - ${error.message}`);
          setLoading(false);
        }
      };

      fetchProduct();
    },
    [id]
  );

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-details">
      <Link to="/">Back to Home</Link>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <button className="add-to-cart-button" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetails;
