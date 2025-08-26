/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from "react";
import { userReducer } from "./reducers";
import { CartContext } from "./CartContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { clearCart } = useContext(CartContext); // Access clearCart

  const initialState = {
    isAuthenticated: !!localStorage.getItem("sessionToken"), // Check token on init
    user: localStorage.getItem("username")
      ? {
          username: localStorage.getItem("username"),
          isAdmin: localStorage.getItem("isAdmin") === "true",
        }
      : null,
    token: localStorage.getItem("sessionToken") || null,
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  // Sync state with localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    const username = localStorage.getItem("username");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (token && !state.isAuthenticated && username) {
      dispatch({
        type: "LOGIN",
        payload: { user: { username, isAdmin }, token }, // Mock user data
      });
    }
  }, []);

  const login = (username, token, isAdmin = false) => {
    localStorage.setItem("isAdmin", isAdmin);
    dispatch({
      type: "LOGIN",
      payload: { user: { username, isAdmin }, token },
    });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("isAdmin");
    clearCart(); // Clear cart on logout
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        login,
        logout,
        isAuthenticated: state.isAuthenticated,
      }}>
      {children}
    </UserContext.Provider>
  );
};
