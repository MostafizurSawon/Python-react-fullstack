import { useEffect } from "react";
import { useUser } from "../context/UserContext";

const LogoutPage = () => {
  const { logout } = useUser();

  useEffect(() => {
    logout(); // Use the logout function from context
  }, [logout]);

  return (
    <div className="container mt-5 text-center">
      <h2>Logging out...</h2>
      <p>You will be redirected to the login page shortly.</p>
    </div>
  );
};

export default LogoutPage;