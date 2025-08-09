// src/axiosInstance.js
import axios from 'axios';

// Create instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Your backend API base URL
  withCredentials: true, // If using cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (adds Authorization header)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle global errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        // e.g., window.location.href = '/login';
      } else if (error.response.status === 403) {
        console.error("Forbidden!");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
