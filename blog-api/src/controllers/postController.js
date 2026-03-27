const Post = require("../models/Post");
const { postSchema } = require("../utils/validators");
const path = require("path");
const fs = require("fs");

exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const posts = await Post.find()
      .populate("author", "username email")
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments();

    res.status(200).json({
      count: posts.length,
      pagination: {
        page,
        limit,
        total,
      },
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

exports.searchPosts = async (req, res, next) => {
  try {
    const { q, tag } = req.query;
    let query = {};

    if (q) {
      query.$text = { $search: q };
    }
    if (tag) {
      query.tags = tag;
    }

    const posts = await Post.find(query).populate("author", "username");
    res.status(200).json({ count: posts.length, data: posts });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email",
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
};

exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user.id });
    res.status(200).json({ count: posts.length, data: posts });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const postData = {
      ...req.body,
      author: req.user.id,
    };

    if (req.file) {
      postData.imageUrl = `/public/uploads/${req.file.filename}`;
    }

    // Convert tags string to array if needed
    if (typeof postData.tags === "string") {
      postData.tags = postData.tags.split(",").map((tag) => tag.trim());
    }

    const post = await Post.create(postData);
    res.status(201).json({ data: post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Authorization
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "User not authorized to update this post" });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/public/uploads/${req.file.filename}`;
    }

    if (typeof updateData.tags === "string") {
      updateData.tags = updateData.tags.split(",").map((tag) => tag.trim());
    }

    post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Authorization
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "User not authorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ data: {} });
  } catch (err) {
    next(err);
  }
};
