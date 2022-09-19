const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String, required: false },
  cloudinaryId: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);
