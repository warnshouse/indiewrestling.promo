const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const promosController = require("../controllers/promos");
const authMiddleware = require("../middleware/auth");

//Promotion Routes - simplified for now
router.get("/", promosController.getPromos);
router.get("/promo/:id", promosController.getPromo);
router.get("/add", authMiddleware.ensureAuth, promosController.getForm);
router.post("/add", authMiddleware.ensureAuth, upload.single("file"), promosController.postForm);

module.exports = router;
