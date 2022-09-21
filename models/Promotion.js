const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  promoName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  description: { type: String, required: true },
  promoImage: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  roster: [{ type: ObjectId, ref: "User" }],
  ownedBy: [{ type: ObjectId, ref: "User" }],
  joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Promotion", PromotionSchema);
