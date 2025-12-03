import type { Request, Response, NextFunction } from 'express';
// Impor tipe NormalizedUser Anda agar TypeScript senang
import type { NormalizedUser } from '../types/index.js'; 

export const adminOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // authMiddleware seharusnya sudah berjalan, tapi kita cek lagi
  if (!req.user) {
    return res.status(401).json({ message: 'Otentikasi diperlukan' });
  }

  // Gunakan tipe NormalizedUser yang sudah Anda definisikan
  const user = req.user as NormalizedUser;

  // 🔑 KOREKSI KUNCI: Gunakan 'role_name' (bukan 'role')
  // Kita asumsikan peran admin Anda dinormalisasi menjadi 'admin'
  if (user.role_name !== 'admin_diskominfo') {
    return res.status(403).json({ 
      message: 'Akses ditolak. Hanya administrator yang diizinkan.' 
    });
  }

  // Jika lolos (adalah admin), lanjutkan
  next();
};