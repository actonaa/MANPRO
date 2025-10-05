import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload as OriginalJwtPayload } from "jsonwebtoken";

// Payload JWT kustom sesuai kebutuhan aplikasi Anda
export interface CustomJwtPayload extends OriginalJwtPayload {
  sub: string;
  email: string;
  role: { role_id: string; role_name: string };
  dinas: string;
  bidang?: string;
  seksi?: string;
}

// Tambahkan properti 'user' ke Request Express
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
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

    // 5. Gunakan type guard agar aman
    if (typeof decoded === "object" && decoded !== null) {
      req.user = decoded as CustomJwtPayload;
      return next();
    } else {
      return res.status(401).json({ message: "Payload token tidak valid." });
    }
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa." });
  }
};
