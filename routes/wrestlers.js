const express = require("express");
const router = express.Router();
const wrestlersController = require("../controllers/wrestlers");
const authMiddleware = require("../middleware/auth");

//Wrestler Routes - simplified for now
router.get("/", wrestlersController.getWrestlers);
router.get("/:id", wrestlersController.getWrestler);
router.put("/add/:id", authMiddleware.ensureAuth, wrestlersController.addWrestler);
router.put("/follow/:id", authMiddleware.ensureAuth, wrestlersController.putFollow);
router.put("/delete/:id", authMiddleware.ensureAuth, wrestlersController.deleteWrestler);

module.exports = router;
