import express from "express";
import { getDashboardStats } from "../controllers/admin.controller.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", requireSignIn, isAdmin, getDashboardStats);

export default router;
