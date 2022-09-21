const { postOwnerSignup } = require("../controllers/auth");

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/feed");
    }
  },
  ensureFan: function (req, res, next) {
    if (req.isAuthenticated() && req.user.isFan) {
      return next();
    } else {
      res.redirect("/feed");
    }
  },
  ensureOwner: function (req, res, next) {
    if (req.isAuthenticated() && req.user.isOwner) {
      return next();
    } else {
      res.redirect("/feed");
    }
  },
  ensureWrestler: function (req, res, next) {
    if (req.isAuthenticated() && req.user.isWrestler) {
      return next();
    } else {
      res.redirect("/feed");
    }
  }
};
