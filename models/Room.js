import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    floor: { type: String, required: true },
    library: { type: String, required: true },
    capacity: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    amenities: [{ type: String }],
    owner: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
