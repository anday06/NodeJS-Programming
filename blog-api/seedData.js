const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./src/models/User");
const Post = require("./src/models/Post");

dotenv.config();

// Connect DB
mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    // 1. Dọn dẹp Database cũ (để tránh lỗi trùng lặp khi chạy nhiều lần)
    await Post.deleteMany();
    await User.deleteMany();

    // 2. Tạo 1 User mới làm Tác Giả
    const createdUser = await User.create({
      username: "admin123",
      email: "admin@blog.com",
      password: "password123", // Code của bạn vốn tự hash trong model rồi, nhưng để test thì đặt thẳng
      role: "admin", // Đặt luôn là admin (Có Bonus Point)
    });

    const adminId = createdUser._id;

    // 3. Tạo sẵn 3 bài viết mẫu có chứa nội dung & tags
    await Post.insertMany([
      {
        title: "Chào mừng đến với Blog REST API của tôi",
        content:
          "Đây là bài viết đầu tiên để test API tìm kiếm và phân trang do hệ thống tự sinh ra.",
        author: adminId,
        tags: ["api", "nodejs", "test"],
      },
      {
        title: "Hướng dẫn xây dựng tính năng Upload Ảnh với Multer",
        content:
          "Nội dung bài viết số 2 với các thông tin về việc xử lý multipart/form-data trong NodeJS.",
        author: adminId,
        tags: ["upload", "javascript"],
      },
      {
        title: "Kiểm tra Role Admin và Tính năng Xóa Bài Viết",
        content:
          "Tôi có Role Admin nên tôi có thể xóa bài bất kỳ, hoặc xoá chính bài viết này để nộp bài kiếm điểm thưởng.",
        author: adminId,
        tags: ["security", "admin"],
      },
    ]);

    console.log("================================");
    console.log("=> ✅ Database đã được Nạp Data Test thành công!");
    console.log("================================");
    process.exit();
  } catch (error) {
    console.error("Lỗi khi nạp Data Test:", error);
    process.exit(1);
  }
};

importData();
