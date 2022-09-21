const mongoose = require("mongoose");
const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

module.exports = {
  getOwnProfile: async (req, res) => {
    try {
      const posts = await Post.find({ userId: req.user.id });
      res.render("main/profile.ejs", { posts: posts, profileUser: req.user, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getUserProfile: async (req, res) => {
    try {
      const queriedUser = await User.findOne({ userName: { $regex : new RegExp(req.params.username, "i") } });
      if (queriedUser.isFan) {
        const posts = await Post.find({ userId: queriedUser.id });
        const isFollowing = req.user.followedUsers.some(ele => ele._id.toString() === queriedUser.id);
        res.render("main/profile.ejs", { isFollowing: isFollowing, posts: posts, profileUser: queriedUser, user: req.user });
      }
      else if (queriedUser.isWrestler) {
        res.redirect(`/wrestlers/${queriedUser.ringName}`);
      }
    } catch (err) {
      console.log(err);
    }
  },
  putAvatar: async (req, res) => {
    try {
      if (req.fileValidationError) {
        const validationErrors = [];
        validationErrors.push({ msg: "Image file type is not supported." });
        req.flash("errors", validationErrors);
        return res.redirect("/profile");
      }

      // Delete existing avatar from cloudinary
      if (req.user.cloudinaryId) {
        await cloudinary.uploader.destroy(req.user.cloudinaryId);
      }

      // Upload new avatar to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          userImage: result.secure_url,
          cloudinaryId: result.public_id
        }
      );
      console.log("Avatar has been updated!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find({ userId: { $in: req.user.followedUsers } }).sort({ createdAt: "desc" }).lean();
      res.render("main/feed.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: "asc" }).lean();
      res.render("posts/post.ejs", { post: post, comments: comments, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      if (req.fileValidationError) {
        const validationErrors = [];
        validationErrors.push({ msg: "Image file type is not supported." });
        req.flash("errors", validationErrors);
        return res.redirect("/profile");
      }

      if (req.file) {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        await Post.create({
          title: req.body.title,
          text: req.body.text,
          image: result.secure_url,
          cloudinaryId: result.public_id,
          userId: req.user.id,
          userName: req.user.userName,
          userImage: req.user.userImage
        });
      } else {
        await Post.create({
          title: req.body.title,
          text: req.body.text,
          image: "",
          cloudinaryId: "",
          userId: req.user.id,
          userName: req.user.userName,
          userImage: req.user.userImage
        });
      }
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.redirect("/profile");
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      if (post.cloudinaryId) {
        await cloudinary.uploader.destroy(post.cloudinaryId);
      }
      // Delete post from db
      await Post.deleteOne({ _id: req.params.id });
      // Delete post's comments from db
      await Comment.deleteMany({ postId: req.params.id });
      console.log("Deleted post and any comments.");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  }
};
