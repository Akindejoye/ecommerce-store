import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Navbar />
        <Home />
      </ErrorBoundary>
    ),
  },
  {
    path: "/error",
    element: (
      <>
        <Navbar />
        <ErrorPage />
      </>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <>
        <Navbar />
        <ProductDetails />
      </>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <>
        <Navbar />
        <ErrorPage message="Page not found." />
      </>
    ),
  },
]);

export default router;
