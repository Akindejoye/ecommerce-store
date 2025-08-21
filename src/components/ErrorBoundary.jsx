import { Component } from "react";
import { Navigate } from "react-router-dom";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Navigate
          to="/error"
          replace
          state={{ message: "An unexpected error occured." }}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
