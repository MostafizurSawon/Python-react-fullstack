// src/utils/myaxios.js
import axios from "axios";

// baseURL: "https://recipe-drf.onrender.com/",
let baseURL = "http://127.0.0.1:8000/";

const myaxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the Authorization header
myaxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Use "Bearer" for JWT
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
myaxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default myaxios;