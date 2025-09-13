import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      console.error('Request timeout');
    }
    
    return Promise.reject(error);
  }
);


