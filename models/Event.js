const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: false },
  description: { type: String, required: true },
  eventImage: { type: String, required: false },
  cloudinaryId: { type: String, required: false },
  participants: { type: String, required: false },
  promoId: { type: ObjectId, ref: "User" },
  promoName: { type: String, required: true },
  startDate: { type: Date, required: true },
  postedBy: { type: ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", EventSchema);
