import axios from "axios";

// Access environment variables from Vite
// Fallback to localhost if not provided
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for cookies/sessions
});

export { API_BASE_URL };
export default api;
