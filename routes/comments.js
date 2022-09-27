const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const authMiddleware = require("../middleware/auth");

//Comment Routes - simplified for now
router.post("/createEventComment/:id", authMiddleware.ensureAuth, commentsController.createEventComment);
router.post("/createPostComment/:id", authMiddleware.ensureAuth, commentsController.createPostComment);
router.delete("/deleteComment/:id", authMiddleware.ensureAuth, commentsController.deleteComment);

module.exports = router;
