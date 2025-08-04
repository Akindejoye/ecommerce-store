import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, isAuthenticated, logout } = useContext(UserContext);

  // const cartItemCount = cart.items.reduce(
  //   (sum, item) => sum + item.quantity,
  //   0
  // );

  return (
    <nav className="navbar">
      <h1>E-Store</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cart">Cart ({cart.items.length})</Link>
        </li>
        <li>{isAuthenticated && <Link to="/checkout">Checkout</Link>}</li>
        <li>
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.username || "User"}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
