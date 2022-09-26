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
      const roster = (req.body.roster !== "") ? req.body.roster.split(", ") : [];

      await Promotion.create({
        promoName: req.body.name,
        city: req.body.city,
        state: req.body.state,
        description: req.body.description,
        promoImage: result.secure_url,
        cloudinaryId: result.public_id,
        siteURL: req.body.siteURL
      });

      if (roster.length > 0) {
        let member = null;
        for (let i = 0; i < roster.length; i++) {
          member = await User.findOne({ userName: roster[i] });
          await Promotion.findOneAndUpdate({ promoName: req.body.name }, { $push: { roster: member.id } });
        }
      }

      console.log("Promotion has been added!");
      res.redirect("/promos");
    } catch (err) {
      console.log(err);
    }
  },
  removePromo: async (req, res) => {
    try {
      // Find promotion by its name
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
        const promo = await Promotion.findOne({ promoName: req.body.promo });
        const teammates = (req.body.teammates !== "") ? req.body.teammates.split(", ") : [];

        await User.findByIdAndUpdate(selectedUser.id, 
          { $set: { 
            isWrestler: true,
            proName: req.body.proName,
            proImage: result.secure_url,
            pCloudinaryId: result.public_id,
            height: req.body.height,
            weight: req.body.weight,
            biography: req.body.bio,
            teammates: [],
            teams: req.body.teams
            },
            $unset: { isFan: "" }
          }
        );

        if (req.body.promo !== "") {
          await Promotion.findOneAndUpdate({ promoName: req.body.promo }, { $push: { roster: selectedUser.id } });
        }

        if (teammates.length > 0) {
          let teammate = null;
          for (let i = 0; i < teammates.length; i++) {
            teammate = await User.findOne({ userName: teammates[i] });
            await User.findByIdAndUpdate(selectedUser.id, { $push: { teammates: teammate.id } });
          }
        }
        console.log("Wrestler added!");
      } else {
        console.log("User could not be found!");
      }
      res.redirect("/wrestlers");
    } catch (err) {
      console.log(err);
      res.redirect("/wrestlers");
    }
  },
  removeWrestler: async (req, res) => {
    try {
      // Find wrestler by user name
      const wrestler = await User.findOne({ userName: req.body.userName });
      
      if (wrestler) {
        // Delete wrestler's image from cloudinary
        await cloudinary.uploader.destroy(wrestler.pCloudinaryId);

        await User.findByIdAndUpdate(wrestler.id, 
          { $set : { isFan: true }, 
            $unset: { 
              isWrestler: "",
              proName: "",
              proImage: "",
              pCloudinaryId: "",
              height: "",
              weight: "",
              biography: "",
              teammates: [],
              teams: ""
            }
          }
        );

        // Delete wrestler from users' followed users
        await User.updateMany({}, { $pull: { followedUsers: wrestler.id } });
        console.log("Removed wrestler status and deleted from users' followed users.");
      } else {
        console.log("Wrestler not found!");
      }
      res.redirect("/wrestlers");
    } catch (err) {
      console.log(err);
      res.redirect("/wrestlers");
    }
  },
  addOwner: async (req, res) => {
    try {
      const selectedUser = await User.findOne({ userName: req.body.userName });
      if (selectedUser) {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        await User.findByIdAndUpdate(selectedUser.id, 
          { $set: { 
            isOwner: true,
            proName: req.body.proName,
            proImage: result.secure_url,
            pCloudinaryId: result.public_id,
            biography: req.body.bio
            },
            $unset: { isFan: "" }
          }
        );

        console.log("Owner added!");
      } else {
        console.log("User could not be found!");
      }
      res.redirect("/promos/owners");
    } catch (err) {
      res.redirect("/promos/owners");
      console.log(err);
    }
  },
  removeOwner: async (req, res) => {
    try {
      // Find owner by user name
      const owner = await User.findOne({ userName: req.body.userName });
      
      if (owner.isOwner) {
        // Delete owner's image from cloudinary
        await cloudinary.uploader.destroy(owner.pCloudinaryId);

        await User.findByIdAndUpdate(owner.id, 
          { $set : { isFan: true }, 
            $unset: { 
              isOwner: "",
              proName: "",
              proImage: "",
              pCloudinaryId: "",
              biography: ""
            }
          }
        );

        // Delete owner from users' followed users
        await User.updateMany({}, { $pull: { followedUsers: owner.id } });
        console.log("Removed owner status and deleted from users' followed users.");
      } else {
        console.log("Owner not found!");
      }
      res.redirect("/promos");
    } catch (err) {
      res.redirect("/promos");
      console.log(err);
    }
  }
};
