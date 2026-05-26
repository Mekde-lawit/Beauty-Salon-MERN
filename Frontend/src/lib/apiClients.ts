import axios from "axios";
import { LoginAccount } from "../types";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8001/api/" ||
    "https://salon.proaddismarketing.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // optional: if using cookies for auth
});

apiClient.interceptors.request.use((config) => {
  const token: LoginAccount | null = sessionStorage.getItem("authToken")
    ? JSON.parse(sessionStorage.getItem("authToken") as string)
    : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token?.token}`;
  }
  return config;
});

export default apiClient;
