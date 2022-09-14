const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const authMiddleware = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", authMiddleware.ensureGuest, homeController.getIndex);
router.get("/profile", authMiddleware.ensureAuth, postsController.getProfile);
router.get("/feed", authMiddleware.ensureAuth, postsController.getFeed);

module.exports = router;
