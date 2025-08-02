import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/cart.css";

function Cart() {
  const { cart } = useContext(CartContext);

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.items.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price.toFixed(2)} * {item.quantity}
            </li>
          ))}
          <p>Total: ${cart.total.toFixed(2)}</p>
        </ul>
      )}
    </div>
  );
}

export default Cart;
