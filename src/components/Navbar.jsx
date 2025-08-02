import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);

  const cartItemCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <nav className="navbar">
      <h1>E-Store</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cart">Cart ({cartItemCount})</Link>
        </li>
        <li>
          {user.isAuthenticated ? (
            <>
              <span>Welcome, {user.user?.username}</span>
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
