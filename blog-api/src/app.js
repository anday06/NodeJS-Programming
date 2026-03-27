require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middlewares/error");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (Bonus request)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api/", limiter);

// Serve static images
app.use("/public", express.static(path.join(__dirname, "../public")));

// Default Root Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Blog API" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

// Xóa phần app.listen cứng để phục vụ việc test
// app.listen sẽ được chuyển ra ngoài hoặc kiểm tra qua module.parent
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
