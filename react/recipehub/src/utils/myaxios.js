// src/utils/myaxios.js
import axios from "axios";

// let baseURL = "https://recipe-drf.onrender.com/";
let baseURL = "http://127.0.0.1:8000/";

const myaxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

myaxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

myaxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default myaxios;