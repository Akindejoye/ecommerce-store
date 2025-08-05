import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import { postOrder } from "../api/api";
import { Link } from "react-router-dom";
import "../styles/checkout.css";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      setError("All field are required");
      return;
    }
    setLoading(true);
    try {
      const order = {
        userId: user?.username || "guest",
        items: cart.items,
        total: cart.total,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      console.log(order);
      await postOrder(order);
      clearCart();
      setOrderStatus("Order placed successfully!");
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <p>Your cart is empty</p>
        <Link to="/">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="cart-summary">
        <h3>Order Summary</h3>
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <p>{item.name}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <h4>Total: ${cart.total.toFixed(2)}</h4>
      </div>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Shipping Information</h3>
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
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
        {error && <p className="error">{error}</p>}
        {orderStatus && <p className="success">{orderStatus}</p>}
      </form>
    </div>
  );
}

export default Checkout;
