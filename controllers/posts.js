const mongoose = require("mongoose");
const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");
const { postOwnerSignup } = require("./auth");

module.exports = {
  getOwnProfile: async (req, res) => {
    try {
      const posts = await Post.find({ authorId: req.user.id });
      res.render("main/profile.ejs", { posts: posts, profileuser: req.user, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getUserProfile: async (req, res) => {
    try {
      const queriedUser = await User.findOne({ userName: { $regex : new RegExp(req.params.username, "i") } });
      const posts = await Post.find({ authorId: queriedUser.id });
      const isFollowing = req.user.followedUsers.some(ele => ele._id.toString() === queriedUser.id);
      res.render("main/profile.ejs", { isfollowing: isFollowing, posts: posts, profileuser: queriedUser, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  putFollow: async (req, res) => {
    try {
      const isFollowing = req.user.followedUsers.some(ele => ele._id.toString() === req.params.id);

      if (!isFollowing) {
        await User.findByIdAndUpdate(req.user.id, { $push: { followedUsers: req.params.id } });
        console.log("User followed!");
      } else {
        await User.findByIdAndUpdate(req.user.id, { $pull: { followedUsers: req.params.id } } );
        console.log("User unfollowed!");
      }

      const followedUser = await User.findOne({ id: req.params.id });
      res.redirect(`/profile/${followedUser.userName}`);
    } catch (err) {
      console.log(err);
    }
  },
  putAvatar: async (req, res) => {
    try {
      // Delete existing avatar from cloudinary
      if (req.user.cloudinaryId) {
        await cloudinary.uploader.destroy(req.user.cloudinaryId);
      }

      // Upload new avatar to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          avatarImage: result.secure_url,
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
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("main/feed.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("posts/post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        author: req.user.userName,
        authorId: req.user.id
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 }
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.deleteOne({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  }
};
