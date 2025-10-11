// src/types/express-request.ts
import type { Request } from "express";

export type RequestWithId<T = {}> = Request<{ id: string } & T>;
