const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  originId: { type: ObjectId, ref: "Post" },
  userId: { type: ObjectId, ref: "User" },
  userName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);
