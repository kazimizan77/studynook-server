import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

export const createBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Double booking check
    const conflict = await Booking.findOne({
      room: roomId,
      status: "confirmed",
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
        {
          startTime: { $lte: new Date(startTime) },
          endTime: { $gte: new Date(endTime) },
        },
      ],
    });

    if (conflict)
      return res
        .status(409)
        .json({ message: "Room already booked for this time slot!" });

    const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    const totalPrice = hours * room.pricePerHour;

    const booking = await Booking.create({
      room: roomId,
      roomName: room.name,
      roomImage: room.image,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
      startTime,
      endTime,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ "user.id": req.user.id }).sort({
      createdAt: -1,
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.id !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
