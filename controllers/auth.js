const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("auth/login.ejs", {
    title: "Login",
    user: req.user
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/auth/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/auth/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    console.log("User has logged out.");
    if (err) {
      console.log("Error: Failed to destroy the session during logout.", err);
    }
    req.session = null;
    res.redirect("/");
  });
};

exports.getFanSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("auth/signupfan.ejs", {
    title: "Create Fan Account",
    user: req.user
  });
};

exports.getOwnerSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("auth/signupowner.ejs", {
    title: "Create Promotion Owner Account",
    user: req.user
  });
};

exports.getWrestlerSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("auth/signupwrestler.ejs", {
    title: "Create Wrestler Account",
    user: req.user
  });
};

exports.postFanSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.userName, { min: 2 }))
    validationErrors.push({ msg: "User name must be at least 2 characters long." });
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long."
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    avatarImage: "",
    cloudinaryId: ""
  });

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists."
        });
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/profile");
        });
      });
    }
  );
};

exports.postOwnerSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.userName, { min: 2 }))
    validationErrors.push({ msg: "User name must be at least 2 characters long." });
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long."
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup/o");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    isFan: false,
    isWrestler: false,
    isOwner: true,
    avatarImage: "",
    cloudinaryId: ""
  });

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists."
        });
        return res.redirect("../signup/o");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/profile");
        });
      });
    }
  );
};

exports.postWrestlerSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.userName, { min: 2 }))
    validationErrors.push({ msg: "User name must be at least 2 characters long." });
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long."
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup/w");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    isFan: false,
    isWrestler: true,
    isOwner: false,
    avatarImage: "",
    cloudinaryId: ""
  });

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists."
        });
        return res.redirect("../signup/w");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/profile");
        });
      });
    }
  );
};
