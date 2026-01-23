import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import apiRouter from "./routes";
import { ZodError } from "zod";
import { adminDistDir, hasAdminDist, publicDir, uploadsDir, ensureContentInitialized } from "./contentStore";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOrigin = process.env.CORS_ORIGIN;
if (corsOrigin) {
  const origins = corsOrigin.split(",").map((o) => o.trim());
  app.use(cors({ origin: origins, credentials: true }));
}

app.use("/api", apiRouter);

app.use("/uploads", express.static(uploadsDir()));
app.use(express.static(publicDir()));

if (hasAdminDist()) {
  app.use("/admin", express.static(adminDistDir()));
  app.get("/admin/*", (_req, res) => {
    res.sendFile(path.join(adminDistDir(), "index.html"));
  });
}

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir(), "index.html"));
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Validation error", details: err.errors });
  }

  if (err.message && err.message.toLowerCase().includes("invalid file type")) {
    return res.status(400).json({ error: err.message });
  }

  console.error("API error:", err);
  res.status(500).json({ error: err.message || "Server error" });
});

ensureContentInitialized()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize content:", error);
    process.exit(1);
  });
