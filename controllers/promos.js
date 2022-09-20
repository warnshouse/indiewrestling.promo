const cloudinary = require("../middleware/cloudinary");
const User = require("../models/User");
const Promotion = require("../models/Promotion");

module.exports = {
  getPromos: async (req, res) => {
    try {
      const promos = await Promotion.find().sort({ joinDate: "desc" }).lean();
      res.render("promos/listing.ejs", { promos: promos, user: req.user });
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
        console.log("Promotion followed!");
      } else {
        await User.findByIdAndUpdate(req.user.id, { $pull: { followedPromos: req.params.id } } );
        console.log("Promotion unfollowed!");
      }

      const followedPromo = await Promotion.findById(req.params.id);
      res.redirect(`/promos/${followedPromo.id}`);
    } catch (err) {
      console.log(err);
    }
  }
};
