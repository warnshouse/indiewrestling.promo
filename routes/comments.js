const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const authMiddleware = require("../middleware/auth");

//Comment Routes - simplified for now
router.post("/createComment/:id", authMiddleware.ensureAuth, commentsController.createComment);
router.delete("/deleteComment/:id", authMiddleware.ensureAuth, commentsController.deleteComment);

module.exports = router;
