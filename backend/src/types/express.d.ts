
import type { NormalizedUser } from './index.js';

declare global {
  namespace Express {
    export interface Request {
      user?: NormalizedUser; 
    }
  }
}
export {};