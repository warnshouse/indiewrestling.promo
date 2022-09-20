const express = require("express");
const router = express.Router();
const wrestlersController = require("../controllers/wrestlers");
const authMiddleware = require("../middleware/auth");

//Wrestler Routes - simplified for now
router.get("/", wrestlersController.getWrestlers);
router.get("/:id", wrestlersController.getWrestler);
router.put("/follow/:id", authMiddleware.ensureAuth, wrestlersController.putFollow);

module.exports = router;
