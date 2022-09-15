const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", authMiddleware.ensureGuest, homeController.getIndex);
router.get("/profile", authMiddleware.ensureAuth, postsController.getProfile);
router.put("/profile/avatar", upload.single("file"), postsController.putAvatar);
router.get("/feed", authMiddleware.ensureAuth, postsController.getFeed);
router.get("/login", authMiddleware.ensureGuest, authController.getLogin);
router.post("/login", authMiddleware.ensureGuest, authController.postLogin);
router.get("/logout", authMiddleware.ensureAuth, authController.logout);
router.get("/signup", authMiddleware.ensureGuest, authController.getFanSignup);
router.get("/o/signup", authMiddleware.ensureGuest, authController.getOwnerSignup);
router.get("/w/signup", authMiddleware.ensureGuest, authController.getWrestlerSignup);
router.post("/signup", authMiddleware.ensureGuest, authController.postFanSignup);
router.post("/o/signup", authMiddleware.ensureGuest, authController.postOwnerSignup);
router.post("/w/signup", authMiddleware.ensureGuest, authController.postWrestlerSignup);

module.exports = router;
