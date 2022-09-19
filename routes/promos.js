const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const promosController = require("../controllers/promos");
const authMiddleware = require("../middleware/auth");

//Promotions Routes - simplified for now
router.get("/", promosController.getPromos);
router.get("/add", promosController.addPromo);
router.post("/add", upload.single("file"), promosController.postPromo);
router.put("/follow/:id", authMiddleware.ensureAuth, promosController.putFollow);
router.delete("/delete/:id", authMiddleware.ensureAuth, promosController.deletePromo);
router.get("/:id", promosController.getPromo);

module.exports = router;
