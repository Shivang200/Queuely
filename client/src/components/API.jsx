import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: `${import.meta.env.VITE_APP_URL}`, // Replace with your backend API
});

// Request Interceptor: Attach JWT Token to Headers
API.interceptors.response.use(
  (response) => response, // If response is OK, return it
  (error) => {
    if (error.response && error.response.status === 403) {
      localStorage.removeItem("token"); // Clear invalid token
      window.location.href = "/signin"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;