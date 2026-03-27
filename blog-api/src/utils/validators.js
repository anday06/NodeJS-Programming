const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin"), // Optional, defaults to user
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())), // can be comma separated or array
});

module.exports = {
  registerSchema,
  loginSchema,
  postSchema,
};
