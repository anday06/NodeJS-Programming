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

### 1. Đăng ký / Đăng nhập

- **Đăng ký tài khoản mới** (`POST /api/auth/register`):
  Kèm Body dạng JSON:
  ```json
  { "username": "dev", "email": "dev@abc.com", "password": "123456" }
  ```
- **Đăng nhập lấy Token** (`POST /api/auth/login`):
  Kèm Body dạng JSON (Chú ý: Không gửi trường username, chỉ dùng email và password):
  ```json
  { "email": "dev@abc.com", "password": "123456" }
  ```
  _(Lưu ý: Copy đoạn `token` trả về để gán vào thư mục Header -> Authorization -> Chọn Bearer Token cho các API bị khoá bên dưới)_

### 2. Các tính năng về Bài Viết (Posts)

- **Xem tất cả bài viết** (`GET /api/posts`):
  Không cần gắn Body. Kết quả xuất danh sách bài viết kèm cấu trúc Phân trang (Pagination) `count`, `page`, `limit`.
- **Viết bài mới & Upload Ảnh** (`POST /api/posts`):
  Yêu cầu Token. Bắt buộc thêm Payload ở tab `form-data` (Không dùng JSON raw). Đính kèm file ảnh `image`, text `title`, text `tags` và text `content`.
- **Sửa bài viết** (`PUT /api/posts/:id`):
  Yêu cầu Token. Sửa nội dung của bài viết do chính bạn tạo.
- **Xóa bài viết** (`DELETE /api/posts/:id`):
  Yêu cầu Token tác giả (hoặc Role là `admin`). Lệnh xoá không gửi data ở Body, chỉ cần ID của bài viết được gắn vào URL (Ví dụ: `/api/posts/65b32a79...`).
- **Lọc tìm kiếm bài viết** (`GET /api/posts/search?q=abc&tag=web`):
  Sử dụng Parameters trên thanh URL để tìm nhanh bài viết theo từ khoá tìm kiếm chung `q` hoặc thẻ riêng biệt `tag`.

### 3. Tính năng Bình luận (Bonus Point)

- **Thêm bình luận** (`POST /api/posts/{postId}/comments`): Body nhập dạng JSON `{ "content": "Bài viết hay!" }`

### 📝 Các lỗi thường gặp khi thao tác (Troubleshooting):

- **Lỗi 404 Cannot POST /register:** Do gọi sai URL, nhớ bổ sung `/api/auth` vào trước.
- **Lỗi 400 "title" is required:** Xảy ra khi test API Login nhưng lại dán nhầm vào URL Create Post. Xin hãy kiểm tra gõ đúng `/api/auth/login` hoặc `/api/posts` tùy mục đích.
- **Lỗi 405 Method Not Allowed / 404 DELETE:** Khi chạy lệnh xóa, bạn không thể xóa chung `/api/posts`. Bắt buộc phải phải copy một mã `_id` cụ thể trên MongoDB dán vào đuôi URL.

Hệ thống có Global Error Handling để trả lỗi theo format `{ "error": "mess..." }` chuẩn RESTful khi có sai sót (Sai Token, Thiếu trường, Dữ liệu không tồn tại...)..
