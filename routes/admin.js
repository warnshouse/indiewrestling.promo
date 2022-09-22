const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const adminController = require("../controllers/admin");
const authMiddleware = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/add/:type", authMiddleware.ensureAuth, adminController.getForm);
router.post("/add/promo", upload.single("file"), adminController.addPromo);
router.delete("/remove/promo", authMiddleware.ensureAuth, adminController.removePromo);
router.put("/add/owner", upload.single("file"), adminController.addOwner);
router.put("/remove/owner", authMiddleware.ensureAuth, adminController.removeOwner);
router.put("/add/wrestler", upload.single("file"), adminController.addWrestler);
router.put("/remove/wrestler", authMiddleware.ensureAuth, adminController.removeWrestler);

module.exports = router;
