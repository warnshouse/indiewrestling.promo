const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  postImage: { type: String, required: false },
  cloudinaryId: { type: String, required: false },
  userId: { type: ObjectId, ref: "User", required: false },
  userName: { type: String, required: false },
  userImage: { type: String, required: false},
  promoId: { type: ObjectId, ref: "Promotion", required: false },
  promoName: { type: String, required: false},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);
