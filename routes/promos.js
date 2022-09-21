const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const promosController = require("../controllers/promos");
const authMiddleware = require("../middleware/auth");

//Promotions Routes - simplified for now
router.get("/", promosController.getPromos);
router.get("/owners", authMiddleware.ensureAuth, promosController.getOwners);
router.get("/owners/:name", authMiddleware.ensureAuth, promosController.getOwner);
router.put("/follow/:id", authMiddleware.ensureAuth, promosController.putFollow);
router.get("/:id", promosController.getPromo);

module.exports = router;
