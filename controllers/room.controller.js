import Room from "../models/Room.js";

export const getAllRooms = async (req, res) => {
  try {
    const { search, amenity } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (amenity) query.amenities = { $in: [amenity] };

    const rooms = await Room.find(query).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const room = await Room.create({
      ...req.body,
      owner: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        image: req.user.image,
      },
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.owner.id !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.owner.id !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
