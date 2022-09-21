const passport = require("passport");
const validator = require("validator");
const nodeMailer = require("nodemailer");
const User = require("../models/User");

module.exports = {
  getLogin: async (req, res) => {
    if (req.user) {
      return res.redirect("/profile");
    }
    res.render("auth/login.ejs", { title: "Login", user: req.user });
  },
  postLogin: async (req, res, next) => {
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
        res.redirect(req.session.returnTo || "/feed");
      });
    })(req, res, next);
  },
  logout: async (req, res) => {
    req.session.destroy((err) => {
      console.log("User has logged out.");
      if (err) {
        console.log("Error: Failed to destroy the session during logout.", err);
      }
      req.session = null;
      res.redirect("/");
    });
  },
  getSignup: async (req, res) => {
    if (req.user) {
      return res.redirect("/profile");
    }
    res.render("auth/signup.ejs", { title: "Create Fan Account", user: req.user });
  },
  postSignup: async (req, res, next) => {
    const validationErrors = [];
    if (!validator.isLength(req.body.userName, { min: 2 }))
      validationErrors.push({ msg: "User name must be at least 2 characters long." });
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (!validator.isLength(req.body.password, { min: 8 }))
      validationErrors.push({
        msg: "Password must be at least 8 characters long."
      });
    if (req.body.password !== req.body.confirmPassword) {
      validationErrors.push({ msg: "Passwords do not match." });
    }
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("../signup");
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      userImage: "",
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
            return next();
          });
        });
      }
    );
  },
  addUserToOwnFollows: async (req, res) => {
    const newUser = await User.findOne({ userName: req.body.userName });
    await User.findByIdAndUpdate(newUser.id, { $push: { followedUsers: newUser.id } });
    res.redirect("/feed");
  },
  getRequestForm: async (req, res) => {
    res.render("auth/request.ejs", {
      title: "Request a Wrestler or Promotion Owner Account",
      user: req.user
    });
  },
  postRequestForm: async (req, res, next) => {
    async function mainMail(name, email, subject, message) {
      const transporter = await nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
      const mailOption = {
        from: email,
        to: process.env.GMAIL_USER,
        subject: subject,
        html: `You got a message from 
        Email : ${email}
        Name: ${name}
        Message: ${message}`,
      };
      try {
        await transporter.sendMail(mailOption);
        return Promise.resolve("Message Sent Successfully!");
      } catch (error) {
        return Promise.reject(error);
      }
    }

    const validationErrors = [];
    if (validator.isEmpty(req.body.userName))
      validationErrors.push({ msg: "Please enter your full name." });
    if (!validator.isEmail(req.body.userEmail))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (validator.isEmpty(req.body.userSubject))
      validationErrors.push({ msg: "Please enter a subject." });
    if (validator.isEmpty(req.body.userMessage))
      validationErrors.push({ msg: "Please enter a message." });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("../request");
    }
    req.body.userEmail = validator.normalizeEmail(req.body.userEmail, { gmail_remove_dots: false });

    try {
      await mainMail(req.body.userName, req.body.userEmail, req.body.userSubject, req.body.userMessage);
      return res.render("auth/sent.ejs", { title: "Message Sent", user: req.user });
    } catch (error) {
      validationErrors.push({ msg: "Message could not be sent." });
      req.flash("errors", validationErrors);
      return res.redirect("../request");
    }
  }
};
