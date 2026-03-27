const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const comment = await Comment.create({
      content,
      post: req.params.postId,
      author: req.user.id,
    });

    res.status(201).json({ data: comment });
  } catch (err) {
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate(
      "author",
      "username",
    );
    res.status(200).json({ count: comments.length, data: comments });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (
      comment.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.status(200).json({ data: {} });
  } catch (err) {
    next(err);
  }
};
