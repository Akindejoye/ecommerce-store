import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <CartProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </CartProvider>
  );
}

export default App;
