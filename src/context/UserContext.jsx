/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useReducer } from "react";
import { userReducer } from "./reducers";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialState = {
    isAuthenticated: !!localStorage.getItem("sessionToken"), // Check token on init
    user: null,
    token: localStorage.getItem("sessionToken") || null,
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  // Sync state with localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (token && !state.isAuthenticated) {
      dispatch({
        type: "LOGIN",
        payload: { user: { username: "Guest" }, token }, // Mock user data
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
  };

  return (
    <UserContext.Provider value={{ user: state, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
