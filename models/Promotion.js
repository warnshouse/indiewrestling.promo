const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  promoName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  ownedBy: { type: String, required: true },
  joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Promotion", PromotionSchema);
