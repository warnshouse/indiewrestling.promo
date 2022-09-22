const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const authMiddleware = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", authMiddleware.ensureAuth, postsController.getPost);
router.post("/createPost", upload.single("file"), postsController.createPost);
router.delete("/deletePost/:id", postsController.deletePost);
router.post("/createComment/:id", postsController.createComment);
router.delete("/deleteComment/:id", postsController.deleteComment);

module.exports = router;
