const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const authMiddleware = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", authMiddleware.ensureGuest, homeController.getIndex);
router.get("/profile", authMiddleware.ensureAuth, postsController.getProfile);
router.get("/feed", authMiddleware.ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
