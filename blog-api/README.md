# RESTful Blog API - Bài Tập Lớn Node.js

Đây là dự án API cho hệ thống Blog cá nhân, với các chức năng như đăng ký/đăng nhập (JWT), xem, thêm, sửa, xóa bài viết, upload ảnh, phân trang, lọc tìm kiếm nội dung, và cho phép quản trị viên tùy ứng.

Dự án được xây dựng đáp ứng theo yêu cầu đánh giá, đảm bảo: Structure chuẩn (Middlewares, Controllers, Models), Validation, Database Index (MongoDB Text Search), Rate Limit... Đồng thời còn xử lý **Bonus Point** (Tính năng tạo & xóa Bình luận trên Bài Viết).

## Yêu Cầu Cài Đặt (Prerequisites)

1. **Node.js** phiên bản v16+
2. **MongoDB** Đang chạy ở cổng tiêu chuẩn (localhost:27017)
3. **Môi trường**: Bạn có thể tham khảo khai báo mẫu trong `app.js` và `.env`

## Hướng Dẫn Chạy (Quick Start)

1. **Clone/Giải nén Source Code** về thư mục máy tính.
2. **Cài Đặt Cấu Hình**:
   Mở terminal tại thư mục làm việc, gõ lệnh để cài các thư viện `dependencies`:
   ```bash
   npm install
   ```
3. **Config Environment (.env)**:
   Nếu bạn không có sẵn, tạo file `.env` ở thư mục ngang `package.json` với nội dung:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/blog_db
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   ```
4. **Chạy server (Dev Mode)**:
   ```bash
   npm run dev
   ```
   **Server và DB chạy thành công sẽ Output:**
   > MongoDB Connected: localhost  
   > Server running on port 5000

## Hướng Dẫn Test Cơ Bản trên Postman

Tất cả endpoint đều có tiền tố `/api/`

1. Đăng ký tài khoản (`POST /api/auth/register`):
   Kèm Body dạng JSON: `{"username": "dev", "email": "dev@abc.com", "password": "123456"}`
2. Copy `token` trả về để dùng cho header `Authorization`: `Bearer <token>` trên những endpoint bị khoá:
   - Viết bài mới (`POST /api/posts`): Sử dụng `form-data` để đính kèm file ảnh `image`, tiêu đề `title`, mảng `tags` và `content`.
   - Lọc bài viết (`GET /api/posts/search?q=abc&tag=web`)
   - Thêm bình luận (`POST /api/posts/{postId}/comments`): Body nhập `{ "content": "Bài viết hay!" }`

Hệ thống có Global Error Handling để trả lỗi theo format `{ error: "mess..." }` chuẩn RESTful khi có sai sót (Sai Token, Thiếu trường, Dữ liệu không tồn tại...).
