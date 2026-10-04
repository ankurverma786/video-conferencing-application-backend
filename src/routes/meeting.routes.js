import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { joinMeeting } from "../controllers/meeting.controller.js";

const router = express.Router();

router.post("/join", authMiddleware, joinMeeting);

export default router;