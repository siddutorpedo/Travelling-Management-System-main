import express from "express";
import upload from "../utils/multer.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/images", requireSignIn, isAdmin, upload.array("images", 5), (req, res) => {
  try {
    const urls = req.files.map((file) => `/uploads/${file.filename}`);
    res.status(200).json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
