import { Router } from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { requireAuth } from "../middleware/auth";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again позже." }
});

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

router.post("/login", loginLimiter, (req, res) => {
  const password = String(req.body?.password || "");
  const expected = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.JWT_SECRET || "";

  if (!expected || !secret) {
    return res.status(500).json({ error: "Auth is not configured" });
  }

  const expectedBuf = Buffer.from(expected);
  const passwordBuf = Buffer.from(password);
  const isMatch = expectedBuf.length === passwordBuf.length && crypto.timingSafeEqual(expectedBuf, passwordBuf);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const csrfToken = crypto.randomUUID();
  const token = jwt.sign({ sub: "admin", role: "admin" }, secret, { expiresIn: "7d" });

  res.cookie("auth_token", token, getCookieOptions());
  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ ok: true });
});

router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", { path: "/" });
  res.clearCookie("csrf_token", { path: "/" });
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ authenticated: true });
});

export default router;
