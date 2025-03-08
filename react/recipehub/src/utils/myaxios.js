import axios from "axios";

// const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

const myaxios = axios.create({
    // baseURL: "https://inventory-api.teamrabbil.com/api",
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        "Content-Type": "application/json",
        // "X-Custom-Header": "foobar",
        // "X-CSRFToken": csrfToken,
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


// npm install react-csrf
