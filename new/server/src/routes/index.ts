import { Router } from "express";
import authRoutes from "./auth";
import contentRoutes from "./content";
import uploadRoutes from "./upload";

const router = Router();

router.use("/auth", authRoutes);
router.use(contentRoutes);
router.use(uploadRoutes);

export default router;
