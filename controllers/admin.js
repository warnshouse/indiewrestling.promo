const mongoose = require("mongoose");
const cloudinary = require("../middleware/cloudinary");
const User = require("../models/User");
const Promotion = require("../models/Promotion");

module.exports = {
  getForm: async (req, res) => {
    try {
      res.render("admin/manage.ejs", { type: req.params.type, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  addPromo: async (req, res) => {
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
      const promo = await Promotion.findOne({ promoName: req.body.promoName });
      if (promo) {
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(promo.cloudinaryId);
        // Delete promotion from db
        await Promotion.deleteOne({ _id: promo.id });
        // Delete promotion from users' followed promotions
        await User.updateMany({}, { $pull: { followedPromos: promo.id } });
        console.log("Deleted promotion and removed it from all users' followed promotions.");
      } else {
        console.log("Promotion not found and could not be deleted!");
      }
      res.redirect("/promos");
    } catch (err) {
      res.redirect("/promos");
    }
  },
  addWrestler: async (req, res) => {
    try {
      const selectedUser = await User.findOne({ userName: req.body.userName });
      if (selectedUser) {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        await User.findByIdAndUpdate(selectedUser.id, 
          { $set: { 
            isWrestler: true,
            ringName: req.body.ringName,
            wrestlerImage: result.secure_url,
            wCloudinaryId: result.public_id,
            height: req.body.height,
            weight: req.body.weight,
            biography: req.body.bio,
            partners: req.body.partners,
            factions: req.body.factions,
            promos: req.body.promos
            },
            $unset: { isFan: "" }}
        );
        await User.findByIdAndUpdate(req.params.id, { $unset: { isFan: "" } });
        console.log("Wrestler added!");
      } else {
        console.log("User could not be found!");
      }
      res.redirect(`/wrestlers`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteWrestler: async (req, res) => {
    try {
      // Find wrestler by ring name
      const wrestler = await User.findOne({ ringName: req.body.ringName });
      
      if (wrestler) {
        // Delete wrestler's image from cloudinary
        await cloudinary.uploader.destroy(wrestler.wCloudinaryId);

        await User.findByIdAndUpdate(wrestler.id, 
          { $set : { isFan: true }, 
            $unset: { 
              isWrestler: "",
              ringName: "",
              wrestlerImage: "",
              wCloudinaryId: "",
              height: "",
              weight: "",
              biography: "",
              partners: "",
              factions: "",
              promos: ""
           }
          }
        );

        // Delete wrestler from users' followed wrestlers
        await User.updateMany({}, { $pull: { followedWrestlers: wrestler.id } });
        console.log("Deleted wrestler status and removed from users' followed users.");
      } else {
        console.log("Wrestler not found and could not be deleted!");
      }
      res.redirect("/wrestlers");
    } catch (err) {
      res.redirect("/wrestlers");
    }
  }
};
