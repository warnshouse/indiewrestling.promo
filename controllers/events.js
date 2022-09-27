const mongoose = require("mongoose");
const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
const Event = require("../models/Event");
const Promotion = require("../models/Promotion");
const Comment = require("../models/Comment");

module.exports = {
  getEvents: async (req, res) => {
    try {
      const events = await Event.find({ startDate: { $gte : new Date() } }).sort({ startDate: "desc" }).lean();
      res.render("events/listing.ejs", { events: events, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getEvent: async (req, res) => {
    try {
      const event = await Event.findOne({ eventName: req.params.name });
      const comments = await Comment.find({ eventId: event.id }).sort({ createdAt: "asc" }).lean();
      res.render("events/event.ejs", { comments: comments, event: event, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getEventForm: async (req, res) => {
    try {
      const promos = await Promotion.find({ roster: { $in: req.user.id } }).lean();
      res.render("events/form.ejs", { promos: promos, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createEvent: async (req, res) => {
    try {
      if (req.fileValidationError) {
        const validationErrors = [];
        validationErrors.push({ msg: "Image file type is not supported." });
        req.flash("errors", validationErrors);
        return res.redirect("/events");
      }

      const promo = await Promotion.findOne({ promoName: req.body.promo });

      if (req.file) {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        await Event.create({
          eventName: req.body.name,
          streetAddress: req.body.addy,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          description: req.body.desc,
          eventImage: result.secure_url,
          cloudinaryId: result.public_id,
          participants: req.body.pants,
          promoId: promo.id,
          promoName: promo.promoName,
          startDate: new Date(`${req.body.date} ${req.body.time}`),
          postedBy: req.user.id
        });
      } else {
        await Event.create({
          eventName: req.body.name,
          streetAddress: req.body.addy,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          description: req.body.desc,
          eventImage: "",
          cloudinaryId: "",
          participants: req.body.pants,
          promoId: promo.id,
          promoName: promo.promoName,
          startDate: new Date(`${req.body.date} ${req.body.time}`),
          postedBy: req.user.id
        });
      }
      console.log("Event has been added!");
      res.redirect("/events");
    } catch (err) {
      console.log(err);
      res.redirect("/events");
    }
  },
  deleteEvent: async (req, res) => {
    try {
      // Find event by id
      let event = await Event.findById({ _id: req.params.id });
      // Delete image from cloudinary
      if (event.cloudinaryId) {
        await cloudinary.uploader.destroy(event.cloudinaryId);
      }
      // Delete event from db
      await Event.deleteOne({ _id: req.params.id });
      // Delete event's comments from db
      await Comment.deleteMany({ originId: req.params.id });
      console.log("Deleted event and any comments.");
      res.redirect("/events");
    } catch (err) {
      res.redirect("/events");
    }
  }
};
