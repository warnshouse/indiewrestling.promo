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
      const promo = await Promotion.findOne({ promoName: req.params.name });
      const wrestlers = await User.find({ $and: [ { _id: { $in: promo.roster } }, { isWrestler: true } ] }).lean();
      const owners = await User.find({ $and: [ { _id: { $in: promo.roster } }, { isOwner: true } ] }).lean();
      const isFollowing = req.user.followedPromos.some(ele => ele._id.toString() === promo.id);
      res.render("promos/promo.ejs", { isFollowing: isFollowing, owners: owners, promo: promo, user: req.user, wrestlers: wrestlers });
    } catch (err) {
      console.log(err);
    }
  },
  ownerFollow: async (req, res) => {
    try {
      const owner = await User.findOne({ proName: req.params.name });
      const isFollowing = req.user.followedUsers.some(ele => ele._id.toString() === owner.id);

      if (!isFollowing) {
        await User.findByIdAndUpdate(req.user.id, { $push: { followedUsers: owner.id } });
        console.log("Owner followed!");
      } else {
        await User.findByIdAndUpdate(req.user.id, { $pull: { followedUsers: owner.id } } );
        console.log("Owner unfollowed!");
      }

      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  promoFollow: async (req, res) => {
    try {
      const promo = await Promotion.findOne({ promoName: req.params.name });
      const isFollowing = req.user.followedPromos.some(ele => ele._id.toString() === promo.id);

      if (!isFollowing) {
        await User.findByIdAndUpdate(req.user.id, { $push: { followedPromos: promo.id } });
        console.log("Promotion followed!");
      } else {
        await User.findByIdAndUpdate(req.user.id, { $pull: { followedPromos: promo.id } } );
        console.log("Promotion unfollowed!");
      }

      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  getOwners: async (req, res) => {
    try {
      const owners = await User.find({ isOwner: true }).collation({ locale: "en" }).sort({proName: 1}).lean();
      const promos = [];
      res.render("promos/listing.ejs", { promos: promos, owners: owners, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getOwner: async (req, res) => {
    try {
      const owner = await User.findOne({ proName: req.params.name });
      const promos = await Promotion.find({ roster: { $in: owner.id } }).lean();
      const isFollowing = req.user.followedUsers.some(ele => ele._id.toString() === owner.id);
      res.render("promos/owner.ejs", { isFollowing: isFollowing, promos: promos, owner: owner, user: req.user });
    } catch (err) {
      console.log(err);
    }
  }
};
