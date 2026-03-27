const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Import controllers
const postController = require("../controllers/postController");

// Include other resource routers
const commentRouter = require("./comments");

router.use("/:postId/comments", commentRouter);

router
  .route("/")
  .get(postController.getPosts)
  .post(protect, upload.single("image"), postController.createPost);

router.get("/my-posts", protect, postController.getMyPosts);
router.get("/search", postController.searchPosts);

router
  .route("/:id")
  .get(postController.getPost)
  .put(protect, upload.single("image"), postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
