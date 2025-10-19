import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // ganti sesuai backend aset
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
