const cloudinary = require("../middleware/cloudinary");
const User = require("../models/User");
const Promotion = require("../models/Promotion");

module.exports = {
  getPromos: async (req, res) => {
    try {
      const promos = await Promotion.find().sort({ joinDate: "desc" }).lean();
      const owners = [];
      res.render("promos/listing.ejs", { promos: promos, owners: owners, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPromo: async (req, res) => {
    try {
      const promo = await Promotion.findById(req.params.id);
      const isFollowing = req.user.followedPromos.some(ele => ele._id.toString() === promo.id);
      res.render("promos/promo.ejs", { isFollowing: isFollowing, promo: promo, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  putFollow: async (req, res) => {
    try {
      const isFollowing = req.user.followedPromos.some(ele => ele._id.toString() === req.params.id);

      if (!isFollowing) {
        await User.findByIdAndUpdate(req.user.id, { $push: { followedPromos: req.params.id } });
        console.log("Promotion/Owner followed!");
      } else {
        await User.findByIdAndUpdate(req.user.id, { $pull: { followedPromos: req.params.id } } );
        console.log("Promotion/Owner unfollowed!");
      }

      const followedPromo = await Promotion.findById(req.params.id);
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  getOwners: async (req, res) => {
    try {
      const owners = await User.find({ isOwner: true }).collation({ locale: "en" }).sort({ownerName: 1}).lean();
      const promos = [];
      res.render("promos/listing.ejs", { promos: promos, owners: owners, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getOwner: async (req, res) => {
    try {
      const owner = await User.findOne({ userName: req.params.name });
      const isFollowing = req.user.followedPromos.some(ele => ele._id.toString() === owner.id);
      res.render("promos/owner.ejs", { isFollowing: isFollowing, owner: owner, user: req.user });
    } catch (err) {
      console.log(err);
    }
  }
};
