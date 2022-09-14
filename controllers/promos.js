const cloudinary = require("../middleware/cloudinary");
const Promotion = require("../models/Promotion");

module.exports = {
  getPromos: async (req, res) => {
    try {
      const promos = await Promotion.find().sort({ addedAt: "desc" }).lean();
      res.render("promos/listing.ejs", { promos: promos, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPromo: async (req, res) => {
    try {
      const promo = await Promotion.findById(req.params.id);
      res.render("promos/promo.ejs", { promo: promo, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getForm: (req, res) => {
    try {
      res.render("promos/add.ejs", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  postForm: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Promotion.create({
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        description: req.body.description,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        followers: 0,
        ownedBy: req.user.id
      });
      console.log("Promotion has been added!");
      res.redirect("/promos");
    } catch (err) {
      console.log(err);
    }
  }
};
