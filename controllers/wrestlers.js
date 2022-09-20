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
        const isFollowing = req.user.followedWrestlers.some(ele => ele._id.toString() === wrestler.id);
        res.render("wrestlers/wrestler.ejs", { isFollowing: isFollowing, wrestler: wrestler, user: req.user });
      } else {
        res.redirect("/wrestlers");
      }
    } catch (err) {
      console.log(err);
    }
  },
  putFollow: async (req, res) => {
    try {
      const isFollowing = req.user.followedWrestlers.some(ele => ele._id.toString() === req.params.id);
      if (!isFollowing) {
        await User.findByIdAndUpdate(req.user.id, { $push: { followedWrestlers: req.params.id } });
        console.log("Wrestler followed!");
      } else {
        await User.findByIdAndUpdate(req.user.id, { $pull: { followedWrestlers: req.params.id } } );
        console.log("Wrestler unfollowed!");
      }
      res.redirect(`/wrestlers/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  }
};
