import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload as OriginalJwtPayload } from "jsonwebtoken";

// Struktur dasar payload JWT sesuai aplikasi Anda
export interface CustomJwtPayload extends OriginalJwtPayload {
  sub: string;
  email: string;
  name?: string;
  role: { role_id: string; role_name: string };
  department?: { department_id: string; department_name: string };
  division?: string;
  section?: string | null;
  phone_number?: string;
  skills?: string[];
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Periksa header Authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Akses ditolak: Token tidak disediakan." });
  }

  // 2. Ambil token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Akses ditolak: Token tidak ditemukan." });
  }

  // 3. Ambil secret dari env
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("FATAL ERROR: JWT_SECRET tidak diatur di environment variables.");
    return res.status(500).json({ message: "Kesalahan konfigurasi internal server." });
  }

  try {
    // 4. Verifikasi token
    const decoded = jwt.verify(token, secret);

    // 5. Pastikan decoded object
    if (typeof decoded === "object" && decoded !== null) {
      const payload = decoded as CustomJwtPayload;

      // 🔑 Normalisasi supaya lebih gampang dipakai di service
      req.user = {
        ...payload,
        department_id: payload.department?.department_id || null, // UUID department
        department_name: payload.department?.department_name || null,
        role_name: payload.role?.role_name?.toLowerCase().replace(/ /g, "_") || null
      };

      return next();
    } else {
      return res.status(401).json({ message: "Payload token tidak valid." });
    }
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa." });
  }
};
