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
  addWrestler: async (req, res) => {
    try {
      const selectedUser = await User.findById(req.params.id);
      if (!selectedUser.isWrestler) {
        await User.findByIdAndUpdate(req.params.id, { $set: { 
          isFan: false,
          isWrestler: true,
          ringName: req.body.ringName,
          height: req.body.height,
          weight: req.body.weight,
          biography: req.body.bio,
          partners: req.body.partners,
          factions: req.body.factions,
          promos: req.body.promos
        }});
        console.log("Wrestler added!");
      }
      res.redirect(`/wrestlers`);
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

      //const followedUser = await User.findById(req.params.id);
      //res.redirect(`/wrestlers/${followedUser.userName}`);
      res.redirect(`/wrestlers/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteWrestler: async (req, res) => {
    try {
      // Find wrestler by id
      const wrestler = await User.findById({ _id: req.params.id });
      
      if (wrestler.isWrestler) {
        await User.findByIdAndUpdate(req.params.id, { $set : { isFan: true, isWrestler: false } });

        // Delete promotion from users' followed promotions
        await User.updateMany({}, { $pull: { followedUsers: req.params.id } });
        console.log("Deleted wrestler status and removed from users' followed users.");
      }
      res.redirect("/wrestlers");
    } catch (err) {
      res.redirect("/wrestlers");
    }
  }
}