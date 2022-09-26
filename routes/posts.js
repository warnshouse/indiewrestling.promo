const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const authMiddleware = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/createPost", authMiddleware.ensureAuth, postsController.getPostForm);
router.post("/createPost", upload.single("file"), postsController.createPost);
router.delete("/deletePost/:id", postsController.deletePost);
router.get("/:id", authMiddleware.ensureAuth, postsController.getPost);

module.exports = router;
