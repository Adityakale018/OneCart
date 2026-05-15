import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
    createSplitPayment,
    getSplitPayment,
    getSplitPaymentByCart,
    initiateParticipantPayment,
    verifyParticipantPayment,
    sendReminder,
} from "../controller/splitPaymentController.js";

const router = express.Router();

router.post("/create", isAuth, createSplitPayment);
router.get("/bycart/:cartId", isAuth, getSplitPaymentByCart);
router.get("/:splitId", isAuth, getSplitPayment);
router.post("/:splitId/pay", isAuth, initiateParticipantPayment);
router.post("/verify", isAuth, verifyParticipantPayment);
router.post("/:splitId/remind", isAuth, sendReminder);

export default router;
