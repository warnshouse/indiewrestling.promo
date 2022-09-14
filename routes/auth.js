const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

//Auth Routes - simplified for now
router.get("/login", authMiddleware.ensureGuest, authController.getLogin);
router.post("/login", authMiddleware.ensureGuest, authController.postLogin);
router.get("/logout", authMiddleware.ensureAuth, authController.logout);
router.get("/signup", authMiddleware.ensureGuest, authController.getSignup);
router.post("/signup", authMiddleware.ensureGuest, authController.postSignup);

module.exports = router;
