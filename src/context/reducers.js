export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      // Check if item already exists in cart
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        // Update quantity
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        };
      }
      // Add new item
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      };
    }

    case "REMOVE_FROM_CART": {
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedQuantityItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedQuantityItems.filter((item) => item.quantity > 0), // Remove items with quantity 0
        total: updatedQuantityItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    default:
      return state;
  }
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      // Simulate storing token in localStorage
      localStorage.setItem("sessionToken", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };

    case "LOGOUT":
      // Clear token from localStorage
      localStorage.removeItem("sessionToken");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    default:
      return state;
  }
};
