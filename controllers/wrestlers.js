const { findById } = require("../models/Post");
const Promotion = require("../models/Promotion");
const User = require("../models/User");

module.exports = {
  getWrestlers: async (req, res) => {
    try {
      const wrestlers = await User.find({ isWrestler: true }).collation({ locale: "en" }).sort({ proName: 1 }).lean();
      res.render("wrestlers/listing.ejs", { wrestlers: wrestlers, user: req.user });
    } catch (err) {
      console.log(err);
      res.render("/");
    }
  },
  getWrestler: async (req, res) => {
    try {
      const wrestler = await User.findOne({ proName: req.params.name });
      if (wrestler.isWrestler) {
        const promos = await Promotion.find({ roster: wrestler._id  }).lean();
        const isFollowing = req.user.followedUsers.some(ele => ele._id.toString() === wrestler.id);

        const teammates = [];
        let teammate = null;
        for (let i = 0; i < wrestler.teammates.length; i++) {
          teammate = await User.findById(wrestler.teammates[i]);
          teammates.push(teammate.proName);
        }

        res.render("wrestlers/wrestler.ejs", { isFollowing: isFollowing, promos: promos, teammates: teammates, wrestler: wrestler, user: req.user });
      } else {
        res.redirect("/wrestlers");
      }
    } catch (err) {
      console.log(err);
      res.redirect("/wrestlers");
    }
  },
  putFollow: async (req, res) => {
    try {
      const wrestler = await User.findOne({ proName: req.params.name });
      const isFollowing = req.user.followedUsers.some(ele => ele._id.toString() === wrestler.id);
      if (!isFollowing) {
        await User.findByIdAndUpdate(req.user.id, { $push: { followedUsers: wrestler.id } });
        console.log("User followed!");
      } else {
        await User.findByIdAndUpdate(req.user.id, { $pull: { followedUsers: wrestler.id } } );
        console.log("User unfollowed!");
      }
      res.redirect("back");
    } catch (err) {
      console.log(err);
      res.redirect("back");
    }
  }
};
