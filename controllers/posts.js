const mongoose = require("mongoose");
const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Promotion = require("../models/Promotion");
const Event = require("../models/Event");

module.exports = {
  getOwnProfile: async (req, res) => {
    try {
      const posts = await Post.find({ userId: req.user.id }).lean();
      const comments = await Comment.find({ userId: req.user.id }).lean();
      const feed = posts.concat(comments).sort((a, b) => {
        const keyA = new Date(a.createdAt);
        const keyB = new Date(b.createdAt);

        if (keyA < keyB) {
          return 1;
        }
        else if (keyA > keyB) {
          return -1;
        }
        else {
          return 0;
        }
      });
      res.render("main/profile.ejs", { feed: feed, profileUser: req.user, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getUserProfile: async (req, res) => {
    try {
      const queriedUser = await User.findOne({ userName: { $regex : new RegExp(req.params.username, "i") } });
      if (queriedUser.isFan) {
        const feed = await Comment.find({ userId: queriedUser.id }).sort({ createdAt: "desc" }).lean();
        res.render("main/profile.ejs", { feed: feed, profileUser: queriedUser, user: req.user });
      }
      else if (queriedUser.isWrestler) {
        res.redirect(`/wrestlers/${queriedUser.proName}`);
      }
      else if (queriedUser.isOwner) {
        res.redirect(`/promos/owners/${queriedUser.proName}`);
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
      const followedPosts = await Post.find({ $or: [ { userId: { $in: req.user.followedUsers } }, { promoId : { $in: req.user.followedPromos } } ] }).lean();
      const followedEvents = await Event.find({ promoId: { $in: req.user.followedPromos } }).lean();
      const feed = followedPosts.concat(followedEvents).sort((a, b) => {
        const keyA = new Date(a.createdAt);
        const keyB = new Date(b.createdAt);

        if (keyA < keyB) {
          return 1;
        }
        else if (keyA > keyB) {
          return -1;
        }
        else {
          return 0;
        }
      });
      const promos = await Promotion.find().sort({ joinDate: "asc" }).limit(5).lean();
      const events = await Event.find({ startDate: { $gte : new Date() } }).sort({ startDate: "desc" }).limit(5).lean();
      res.render("main/feed.ejs", { events: events, feed: feed, promos: promos, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPostForm: async (req, res) => {
    try {
      res.render("posts/form.ejs", { user: req.user });
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
          postImage: result.secure_url,
          cloudinaryId: result.public_id,
          userId: req.user.id,
          userName: req.user.userName,
          userImage: req.user.userImage
        });
      } else {
        await Post.create({
          title: req.body.title,
          text: req.body.text,
          postImage: "",
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
      await Comment.deleteMany({ originId: req.params.id });
      console.log("Deleted post and any comments.");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  }
};
