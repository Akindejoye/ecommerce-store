import { Link } from "react-router-dom";
import "../styles/errorPage.css";

function ErrorPage({ message = "Something went wrong. Please try again." }) {
  return (
    <div className="error-page">
      <h2>Error</h2>
      <p>{message}</p>
      <Link to="/" className="home-link">
        Back to Homepage
      </Link>
    </div>
  );
}

export default ErrorPage;
