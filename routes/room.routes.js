import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.post("/", verifyToken, createRoom);
router.put("/:id", verifyToken, updateRoom);
router.delete("/:id", verifyToken, deleteRoom);

export default router;
