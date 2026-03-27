const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middlewares/auth");

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

router.route("/").get(getComments).post(protect, addComment);
router.route("/:id").delete(protect, deleteComment);

module.exports = router;
