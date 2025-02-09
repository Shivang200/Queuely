import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Replace with your backend URL
});

// Request Interceptor: Adds Token to Headers
// 🔹 What is an Interceptor?
// An interceptor is a function that runs before every request.
// Here, it modifies the request to automatically attach the JWT token.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config; // Return the updated config object
  },
  (error) => Promise.reject(error) // Handle request errors
);

export default AxiosInstance;
