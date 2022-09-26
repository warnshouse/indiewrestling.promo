const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const promosController = require("../controllers/promos");
const authMiddleware = require("../middleware/auth");

//Promotions Routes - simplified for now
router.get("/", promosController.getPromos);
router.get("/owners", authMiddleware.ensureAuth, promosController.getOwners);
router.put("/owners/follow/:name", authMiddleware.ensureAuth, promosController.ownerFollow);
router.get("/owners/:name", authMiddleware.ensureAuth, promosController.getOwner);
router.put("/follow/:name", authMiddleware.ensureAuth, promosController.promoFollow);
router.get("/:name", promosController.getPromo);

module.exports = router;
