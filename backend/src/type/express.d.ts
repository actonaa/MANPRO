import type { CustomJwtPayload } from "../middleware/auth.middleware.ts";

declare global {
  namespace Express {
    // Override bawaan Express
    interface Request {
      user: CustomJwtPayload; // sekarang wajib ada (bukan opsional)
    }
  }
}
