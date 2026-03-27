# BÁO CÁO BÀI TẬP LỚN: RESTful Blog API (Authentication & Authorization)

**Học phần:** Lập trình Web với Node.js
**Ngôn ngữ/Công cụ:** Node.js, Express, MongoDB (Mongoose), JWT, Joi, Multer.

## 1. Mục Đích và Yêu Cầu

- Cung cấp mô hình backend (REST API) hoàn chỉnh phục vụ dự án Blog cá nhân cho việc đăng nhập, quản lý và duyệt các tin tức.
- Xử lý xác thực người dùng (Account Authentication & Authorization) dựa vào JSON Web Token (JWT).
- Quản lý kho dữ liệu phân tán không quan hệ qua MongoDB (Collection: `users`, `posts`, `comments`).

## 2. Thiết Kế Hệ Thống Thực Tế

### a. Kiến Trúc (Architecture)

Áp dụng mẫu quản lý Source Code Module theo hướng dẫn chuẩn Web (Middlewares, routes, controllers, models):

- **Models**: Gồm các entity schema Mongoose với cấu hình ràng buộc (`unique`, `required`), tự sinh Indexing (Text index) hỗ trợ truy vấn chữ tìm kiếm (Q Search) để làm Schema Validation.
- **Controllers**: Nơi thao tác dữ liệu, xử lý tính năng (CRUD theo `REST`) tách biệt khỏi routes điều hướng. Xử lý các logic Pagination (Trang `req.query.page`), Regex tìm kiếm Tag/Content.
- **Middlewares**: Ràng buộc quyền truy cập như `auth.js` cho Check Token và Role, `upload.js` quản lý file đính kèm với FileFilter, `error.js` đóng vai trò Exception Handler tập trung nhất quán Output báo lỗi.

### b. Database (Document Models)

- **User**: (Username, Email, Hash(Password), Role [user, admin])
- **Post**: (Title, Content, Author [Ref User], Tags [Array String], ImageUrl, Text Search Index)
- **Comment** (Entity Nâng Cao): Nội dung bình luận cho từng bài viết của Post, được cấp phép xóa bởi Admin / Chủ bình luận.

## 3. Danh Sach API Endpoints Đã Kiểm Thử Trong Quá Trình Phát Triển

| Method | Endpoint                        | Mô tả (Scope)                                           | Auth Yêu Cầu               |
| ------ | ------------------------------- | ------------------------------------------------------- | -------------------------- |
| POST   | `/api/auth/register`            | Đăng ký người dùng và hash mật khẩu                     | Public                     |
| POST   | `/api/auth/login`               | Trả quyền chứng thực JWT Header để đăng nhập            | Public                     |
| GET    | `/api/posts?page=1&limit=10`    | Query danh sách bài có tính năng phân trang             | Public                     |
| GET    | `/api/posts/search?q=ABC..`     | Dynamic API search index `tags` hoặc từ khoá (`query`)  | Public                     |
| GET    | `/api/posts/my-posts`           | Query bài viết user sở hữu                              | `Bearer JWT` (user/admin)  |
| GET    | `/api/posts/:id`                | Xem chi tiết bài viết                                   | Public                     |
| POST   | `/api/posts/`                   | Khởi tạo bài viết, đính kèm `multipart/form-data` image | `Bearer JWT` (user/admin)  |
| PUT    | `/api/posts/:id`                | Chỉnh sửa bài viết, cập nhật ảnh đính kèm               | `Bearer JWT` (owner/admin) |
| DELETE | `/api/posts/:id`                | Xóa bài dựa trên `id`, báo lỗi 403 nếu không thẩm quyền | `Bearer JWT` (owner/admin) |
| POST   | `/api/posts/:postId/comments`   | (Feature Mới) Bình luận vào bài Post                    | `Bearer JWT` (user/admin)  |
| DEL    | `/api/posts/:postId/comments/X` | (Feature Mới) Chủ bình luận/Admin xóa bình luận         | `Bearer JWT` (owner/admin) |

## 4. Các Vấn Đề Và Khó Khăn Gặp Phải

- **Upload File**: Quản lý thao tác form data đa luồng, làm sao để request vẫn lưu file ảnh sau đó truy vào JSON payload. => Dùng thư viện trung gian `multer`.
- **Global Error Handling**: Ban đầu trả lỗi MongoDB `MongoError: 11000` với mã lỗi HTML hoặc format lệch. Khắc phục: Bắt toàn cục tại Route cuối bằng Middleware Error Handler.

## 5. Kết Quả Testing Postman

Mã Code chạy và Output response status (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`) đúng chuẩn kịch bản RESTful.

_Dự án đã đủ điều kiện gửi thư mục .zip để nộp/Chấm điểm Github (10Đ + Tính Năng Điểm Thưởng)._
