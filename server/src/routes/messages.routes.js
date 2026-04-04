import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sendMessage, getConversationsList, getMessagesHistory } from "../controllers/message.controller.js";

const router = express.Router();

router.use(verifyJWT);

// Secure Messaging bounds
router.route("/send").post(sendMessage);
router.route("/conversations").get(getConversationsList);
router.route("/:userId").get(getMessagesHistory);

export default router;
