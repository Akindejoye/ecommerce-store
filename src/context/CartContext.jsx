/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer } from "react";
import { cartReducer } from "./reducers";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const getInitialCart = () => {
    const savedItems = localStorage.getItem("cartItems");
    let items = [];
    if (savedItems) {
      try {
        items = JSON.parse(savedItems);
        // Validate items
        items = items.filter(
          (item) =>
            item &&
            typeof item.id !== "undefined" &&
            typeof item.price === "number" &&
            typeof item.quantity === "number" &&
            item.quantity > 0
        );
      } catch (error) {
        console.warn("Invalid cart items in localStorage", error);
        items = [];
      }
    }
    return {
      items,
      total: items.reduce(
        (sum, item) => sum + item.price * item.price * item.quantity,
        0
      ),
    };
  };

  const [state, dispatch] = useReducer(cartReducer, getInitialCart());

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};
