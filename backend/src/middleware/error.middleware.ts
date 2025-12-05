import type { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(err.stack); // Log error ke konsol

  let statusCode = 500;
  
  if (err.message.includes("tidak ditemukan")) {
    statusCode = 404;
  } else if (err.message.includes("akses")) {
    statusCode = 403; // Forbidden
  } else if (err.message.includes("validasi")) {
    statusCode = 400; // Bad Request
  }

  res.status(statusCode).json({
    message: err.message || 'Terjadi kesalahan pada server',
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};