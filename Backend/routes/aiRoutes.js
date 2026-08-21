import express from "express";
import isAuth from "../middleware/isAuth.js";
import { aiChat, getAiSuggestions, generateProductDetails } from "../controller/aiController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/chat", isAuth, aiChat);
router.get("/suggestions", isAuth, getAiSuggestions);
router.post("/generate-product-details", upload.single("image"), generateProductDetails);

export default router;
