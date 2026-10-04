import express from "express";
import { createRoom , joinRoom } from "../controllers/room.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createRoom);
router.post("/join", authMiddleware, joinRoom);

export default router;