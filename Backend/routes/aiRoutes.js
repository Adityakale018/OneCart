import express from "express";
import isAuth from "../middleware/isAuth.js";
import { aiChat, getAiSuggestions } from "../controller/aiController.js";

const router = express.Router();

router.post("/chat", isAuth, aiChat);
router.get("/suggestions", isAuth, getAiSuggestions);

export default router;
