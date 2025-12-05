// src/services/api.ts

// Ganti dengan URL backend Anda yang sebenarnya
const BASE_URL = "https://asset-risk-management.vercel.app/api"; 

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token"); // Ambil token dari local storage
  
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

  // Deteksi otomatis: Jika bukan FormData, set Content-Type JSON
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API Error: ${res.status}`);
  }

  return res.json();
};