import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
    createSharedCart,
    getSharedCart,
    joinSharedCart,
    addItem,
    updateItem,
    removeItem,
    voteItem,
    toggleLock,
    removeParticipant,
    assignSplits,
    sendChatMessage,
} from "../controller/sharedCartController.js";

const router = express.Router();

router.post("/create", isAuth, createSharedCart);
router.get("/:cartId", isAuth, getSharedCart);
router.post("/join", isAuth, joinSharedCart);
router.post("/:cartId/item", isAuth, addItem);
router.put("/:cartId/item", isAuth, updateItem);
router.delete("/:cartId/item/:itemId", isAuth, removeItem);
router.post("/:cartId/vote", isAuth, voteItem);
router.post("/:cartId/lock", isAuth, toggleLock);
router.delete("/:cartId/participant/:uid", isAuth, removeParticipant);
router.post("/:cartId/splits", isAuth, assignSplits);
router.post("/:cartId/chat", isAuth, sendChatMessage);

export default router;
