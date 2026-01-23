import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthPayload = {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
};

const jwtSecret = () => process.env.JWT_SECRET || "";

export function getAuthPayload(req: Request): AuthPayload | null {
  const token = req.cookies?.auth_token;
  if (!token) return null;

  try {
    return jwt.verify(token, jwtSecret()) as AuthPayload;
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!jwtSecret()) {
    return res.status(500).json({ error: "JWT secret is not configured" });
  }

  const payload = getAuthPayload(req);
  if (!payload) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  (req as Request & { user?: AuthPayload }).user = payload;
  next();
}
