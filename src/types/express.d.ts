import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `any` with a specific type if you know the structure of `user`
    }
  }
}
