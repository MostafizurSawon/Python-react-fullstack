// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import myaxios from "./../utils/myaxios";
import { successToast, errorToast } from "./../utils/toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await myaxios.get("accounts/profile/");
      if (response.data.status === "success") {
        setUser(response.data.data);
      } else {
        errorToast("Failed to fetch user data!");
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      errorToast("Failed to fetch user data!");
      setUser(null);
    }
  };

  // On app load, fetch user data if token exists
  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await myaxios.post("accounts/login/", { email, password });
      if (response.data.status === "success") {
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        await fetchUserData();
        successToast("Login Successful!");
        return true;
      } else {
        errorToast("Login Failed!");
        return false;
      }
    } catch (error) {
      console.error(error);
      errorToast("Login Failed!");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    successToast("Logged out successfully!");
    navigate("/login");
  };

  // Function to refresh user data (e.g., after profile update)
  const refreshUserData = async () => {
    if (token) {
      await fetchUserData();
    }
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);