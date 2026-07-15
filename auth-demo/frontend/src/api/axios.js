import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true, // Important: sends cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - logs requests for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - logs responses for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`, {
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error(`[API] Error ${error.response?.status} from ${error.config?.url}`, {
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;
