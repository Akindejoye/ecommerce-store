import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/product-card.css";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  // console.log(product);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name || "Product image"} />
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;
