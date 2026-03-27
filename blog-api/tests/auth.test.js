const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const User = require("../../src/models/User");

// Bạn cần tách app.listen ra khỏi app.js hoặc mock kết nối DB thực tế trong code thực.
// Ở đây chúng ta sẽ giả lập môi trường test theo yêu cầu của Unit Test.

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    // Kết nối đến Database Test
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/blog_db_test",
    );
  });

  afterAll(async () => {
    // Xoá DB test và đóng kết nối
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany(); // Dọn dẹp collection User sau mỗi test case
  });

  describe("POST /api/auth/register", () => {
    it("nên đăng ký một user mới và trả về token", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("role", "user");
    });

    it("nên báo lỗi 400 nếu thiếu trường bắt buộc", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "testuser@example.com",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/login", () => {
    it("nên đăng nhập thành công với tài khoản hợp lệ", async () => {
      // Đăng ký trước
      await request(app).post("/api/auth/register").send({
        username: "loginuser",
        email: "login@example.com",
        password: "password123",
      });

      // Thử đăng nhập lại
      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    });

    it("nên báo lỗi 401 nếu sai mật khẩu", async () => {
      // Đăng ký trước
      await request(app).post("/api/auth/register").send({
        username: "wrongpassuser",
        email: "wrongpass@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "wrongpass@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toBe("Invalid credentials");
    });
  });
});
