import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { CustomJwtPayload, NormalizedUser } from "../types/index.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Akses ditolak: Token tidak disediakan." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Akses ditolak: Token tidak ditemukan." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("FATAL ERROR: JWT_SECRET tidak diatur di environment variables.");
    return res.status(500).json({ message: "Kesalahan konfigurasi internal server." });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "object" && decoded !== null) {
      const payload = decoded as CustomJwtPayload;

      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
      // 🔑 Bangun objek 'NormalizedUser' yang bersih
      const normalizedUser: NormalizedUser = {
        user_id: payload.sub,
        email: payload.email,
        name: payload.name ?? null,
        role_name: payload.role 
            ? payload.role.toLowerCase().replace(/ /g, "_") 
            : null,
        department_name: payload.department ?? null,
        division: payload.division ?? null,
        section: payload.section ?? null,
        phone_number: payload.phone_number ?? null,
        skills: payload.skills ?? [],
        ip_address: ip
      };

      req.user = normalizedUser;

      return next();
    } else {
      return res.status(401).json({ message: "Payload token tidak valid." });
    }
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa." });
  }
};