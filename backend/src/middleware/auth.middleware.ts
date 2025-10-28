import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../types/model.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  //Periksa header Authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Akses ditolak: Token tidak disediakan." });
  }

  //Ambil token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Akses ditolak: Token tidak ditemukan." });
  }

  //Ambil secret dari env
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("FATAL ERROR: JWT_SECRET tidak diatur di environment variables.");
    return res.status(500).json({ message: "Kesalahan konfigurasi internal server." });
  }

  try {
    //Verifikasi token
    const decoded = jwt.verify(token, secret);

    //Pastikan decoded object
    if (typeof decoded === "object" && decoded !== null) {
      const payload = decoded as User;

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
