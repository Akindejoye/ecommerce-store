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
      ? { username: localStorage.getItem("username") }
      : null,
    token: localStorage.getItem("sessionToken") || null,
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  // Sync state with localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    const username = localStorage.getItem("username");
    if (token && !state.isAuthenticated && username) {
      dispatch({
        type: "LOGIN",
        payload: { user: { username }, token }, // Mock user data
      });
    }
  }, []);

  const login = (username, token) => {
    dispatch({
      type: "LOGIN",
      payload: { user: { username }, token },
    });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
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
