import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/cart.css";

function Cart() {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cart.items.length) {
    return (
      <div className="cart">
        <h2>Your Cart</h2>
        <div className="cart-empty">Your cart is empty</div>
        <Link to="/" className="shop-now-button">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.items.map((item) => (
        <div key={item.id} className="cart-item">
          <h3>{item.name}</h3>
          <p>Price: ${item.price.toFixed(2)}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
          <div className="cart-controls">
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              +
            </button>
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
              -
            </button>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        </div>
      ))}
      <h3>Total: ${cart.total.toFixed(2)}</h3>
      <button className="checkout-button" onClick={() => navigate("/checkout")}>
        Go to Checkout
      </button>
    </div>
  );
}

export default Cart;
