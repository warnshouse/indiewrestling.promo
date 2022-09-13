const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  followers: {
    type: Number,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  addedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Promotion", PromotionSchema);
