const { findById } = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getWrestlers: async (req, res) => {
    try {
      const wrestlers = await User.find({ isWrestler: true }).collation({ locale: "en" }).sort({ ringName: 1 }).lean();
      res.render("wrestlers/listing.ejs", { wrestlers: wrestlers, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getWrestler: async (req, res) => {
    try {
      const wrestler = await User.findById(req.params.id);
      if (wrestler.isWrestler) {
        const isFollowing = req.user.followedUsers.some(ele => ele._id.toString() === wrestler.id);

        const teammates = [];
        let teammate = null;
        for (let i = 0; i < wrestler.teammates.length; i++) {
          teammate = await User.findById(wrestler.teammates[i]);
          teammates.push(teammate.ringName);
        }

        res.render("wrestlers/wrestler.ejs", { isFollowing: isFollowing, teammates: teammates, wrestler: wrestler, user: req.user });
      } else {
        res.redirect("/wrestlers");
      }
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
      res.redirect(`/wrestlers/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  }
};
