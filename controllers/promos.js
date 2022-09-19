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
  },
  addPromo: (req, res) => {
    try {
      res.render("promos/add.ejs", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  postPromo: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Promotion.create({
        promoName: req.body.name,
        city: req.body.city,
        state: req.body.state,
        description: req.body.description,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ownedBy: req.body.owner
      });
      console.log("Promotion has been added!");
      res.redirect("/promos");
    } catch (err) {
      console.log(err);
    }
  },
  deletePromo: async (req, res) => {
    try {
      // Find promotion by id
      const promo = await Promotion.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(promo.cloudinaryId);
      // Delete promotion from db
      await Promotion.deleteOne({ _id: req.params.id });
      // Delete promotion from users' followed promotions
      await User.updateMany({}, { $pull: { followedPromos: req.params.id } });
      console.log("Deleted promotion and removed it from all users' followed promotions.");
      res.redirect("/promos");
    } catch (err) {
      res.redirect("/promos");
    }
  }
};
