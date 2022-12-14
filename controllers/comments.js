const Comment = require("../models/Comment");

module.exports = {
  createPostComment: async (req, res) => {
    try {
      await Comment.create({
        text: req.body.comment,
        postId: req.params.id,
        userId: req.user.id,
        userName: req.user.userName
      });
      console.log("Comment has been added!");
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  createEventComment: async (req, res) => {
    try {
      await Comment.create({
        text: req.body.comment,
        eventId: req.params.id,
        userId: req.user.id,
        userName: req.user.userName
      });
      console.log("Comment has been added!");
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      // Delete comment from db
      await Comment.deleteOne({ _id: req.params.id });
      console.log("Comment has been deleted.");
      res.redirect("back");
    } catch (err) {
      console.log(err);
      res.redirect("back");
    }
  }
};
