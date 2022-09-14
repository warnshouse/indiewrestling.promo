const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

//Auth Routes - simplified for now
router.get("/login", authMiddleware.ensureGuest, authController.getLogin);
router.post("/login", authMiddleware.ensureGuest, authController.postLogin);
router.get("/logout", authMiddleware.ensureAuth, authController.logout);
router.get("/signup", authMiddleware.ensureGuest, authController.getFanSignup);
router.get("/signup/o", authMiddleware.ensureGuest, authController.getOwnerSignup);
router.get("/signup/w", authMiddleware.ensureGuest, authController.getWrestlerSignup);
router.post("/signup", authMiddleware.ensureGuest, authController.postFanSignup);
router.post("/signup/o", authMiddleware.ensureGuest, authController.postOwnerSignup);
router.post("/signup/w", authMiddleware.ensureGuest, authController.postWrestlerSignup);

module.exports = router;
