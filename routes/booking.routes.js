import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/my", verifyToken, getMyBookings);
router.delete("/:id", verifyToken, cancelBooking);

export default router;
