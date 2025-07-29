import { createContext, useReducer } from "react";
import { cartReducer } from "./reducers";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const initialState = {
    items: [],
    total: 0,
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", paylod: product });
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  return (
    <CartContext.Provider
      value={{ cart: state, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
