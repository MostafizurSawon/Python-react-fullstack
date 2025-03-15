import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { errorToast } from "../utils/toast";

const LogoutPage = () => {
  useEffect(() => {
    // Clear token and show toast only once
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Also remove user to match Navbar logic
    errorToast("Logged out!");
  }, []); // Empty dependency array ensures this runs only once on mount

  return <Navigate to="/login/" />;
};

export default LogoutPage;