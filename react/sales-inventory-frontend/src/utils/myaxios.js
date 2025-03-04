import axios from "axios";

const myaxios = axios.create({
    // baseURL: "https://inventory-api.teamrabbil.com/api",
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
        // "X-Custom-Header": "foobar",
    },
});

myaxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default myaxios;
