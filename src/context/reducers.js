export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      // Validate payload
      if (
        !action.payload ||
        typeof action.payload.price !== "number" ||
        !action.payload.id
      ) {
        console.warn("Invalid product in ADD_TO_CART", action.payload);
        return state;
      }

      // Check if item already exists in cart
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      let newItems;
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      return { ...state, items: newItems, total: newTotal };
    }

    case "REMOVE_FROM_CART": {
      if (!action.payload || !action.payload.id) {
        console.warn("Invalid payload in REMOVE_FROM_CART:", action.payload);
        return state;
      }

      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      return { ...state, items: newItems, total: newTotal };
    }

    case "UPDATE_QUANTITY": {
      if (
        !action.payload ||
        !action.payload.id ||
        typeof action.payload.quantity !== "number"
      ) {
        console.warn("Invalid payload in UPDATE_QUANTITY:", action.payload);
        return state;
      }

      const newItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      return { ...state, items: newItems, total: newTotal };
    }

    case "CLEAR_CART":
      localStorage.removeItem("cartItems");
      return { ...state, items: [], total: 0 };

    default:
      return state;
  }
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      // Simulate storing token in localStorage
      localStorage.setItem("sessionToken", action.payload.token);
      localStorage.setItem("username", action.payload.user.username);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };

    case "LOGOUT":
      // Clear token from localStorage
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("username");
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

/*

FUNCTION cartReducer(state, action)
  // state is { items: array of {id, name, price, quantity, ...}, total: number }
  // action is { type: string, payload: object }

  SWITCH action.type
    CASE "ADD_TO_CART":
      // Validate payload
      IF action.payload is null/undefined OR
         action.payload.price is not a number OR
         action.payload.id is null/undefined THEN
        PRINT warning "Invalid product in ADD_TO_CART: {action.payload}"
        RETURN state unchanged
      END IF

      // Check if product with payload.id exists in cart.items
      FIND item in state.items where item.id equals action.payload.id
      IF item exists THEN
        // Increment quantity of existing item
        CREATE newItems by mapping state.items
          FOR each item
            IF item.id equals action.payload.id THEN
              RETURN new item with same properties but quantity increased by 1
            ELSE
              RETURN item unchanged
            END IF
          END FOR
        CALCULATE newTotal as sum of (item.price * item.quantity) for all items in newItems
        RETURN new state with { items: newItems, total: newTotal }
      ELSE
        // Add new product to cart
        CREATE newItems by appending action.payload with quantity=1 to state.items
        CALCULATE newTotal as state.total plus action.payload.price
        RETURN new state with { items: newItems, total: newTotal }
      END IF

    CASE "REMOVE_FROM_CART":
      // Validate payload
      IF action.payload is null/undefined OR
         action.payload.id is null/undefined THEN
        PRINT warning "Invalid payload in REMOVE_FROM_CART: {action.payload}"
        RETURN state unchanged
      END IF

      // Remove item with matching id
      CREATE newItems by filtering state.items to keep items where item.id does not equal action.payload.id
      CALCULATE newTotal as sum of (item.price * item.quantity) for all items in newItems
      RETURN new state with { items: newItems, total: newTotal }

    CASE "UPDATE_QUANTITY":
      // Validate payload
      IF action.payload is null/undefined OR
         action.payload.id is null/undefined OR
         action.payload.quantity is not a number THEN
        PRINT warning "Invalid payload in UPDATE_QUANTITY: {action.payload}"
        RETURN state unchanged
      END IF

      // Update quantity of item with matching id
      CREATE newItems by mapping state.items
        FOR each item
          IF item.id equals action.payload.id THEN
            RETURN new item with same properties but quantity set to action.payload.quantity
          ELSE
            RETURN item unchanged
          END IF
        END FOR
      FILTER newItems to keep only items where quantity > 0
      CALCULATE newTotal as sum of (item.price * item.quantity) for all items in newItems
      RETURN new state with { items: newItems, total: newTotal }

    DEFAULT:
      RETURN state unchanged
  END SWITCH
END FUNCTION


/////////// USER REDUCER ////////////////////

FUNCTION userReducer(state, action)
  // state is { isAuthenticated: boolean, user: object or null, token: string or null }
  // action is { type: string, payload: object }

  SWITCH action.type
    CASE "LOGIN":
      // Store token in localStorage
      SAVE action.payload.token to localStorage under key "sessionToken"
      RETURN new state with:
        isAuthenticated set to true
        user set to action.payload.user
        token set to action.payload.token

    CASE "LOGOUT":
      // Clear token from localStorage
      REMOVE key "sessionToken" from localStorage
      RETURN new state with:
        isAuthenticated set to false
        user set to null
        token set to null

    DEFAULT:
      RETURN state unchanged
  END SWITCH
END FUNCTION

**/
