import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.diskominfo.go.id", // ganti sesuai backend aset
});

// Interceptor untuk menambahkan token JWT ke setiap request
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default api;
