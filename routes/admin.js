const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const adminController = require("../controllers/admin");
const authMiddleware = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/add/:type", authMiddleware.ensureAuth, adminController.getForm);
router.post("/add/promo", upload.single("file"), adminController.addPromo);
router.delete("/delete/promo", authMiddleware.ensureAuth, adminController.deletePromo);
//router.put("/add/owner/:id", authMiddleware.ensureAuth, adminController.addOwner);
//router.put("/delete/owner/:id", authMiddleware.ensureAuth, adminController.deleteOwner);
router.put("/add/wrestler", upload.single("file"), adminController.addWrestler);
router.put("/delete/wrestler", authMiddleware.ensureAuth, adminController.deleteWrestler);

module.exports = router;
