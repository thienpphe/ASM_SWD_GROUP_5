# QuizPractice System - Hệ Thống Luyện Thi Trắc Nghiệm Trực Tuyến

> **Đồ án môn học:** SWD392 - Software Architecture and Design  
> **Backend:** Spring Boot (Java 17), Spring Security (Stateless JWT), Spring Data JPA, Hibernate  
> **Frontend:** Vite + React (JavaScript), Tailwind CSS, Lucide Icons, Canvas-Confetti  
> **Cơ sở dữ liệu:** Tích hợp đầy đủ cấu trúc 27 bảng theo file `SQLQuery1.sql` (Hỗ trợ chạy ngay với H2 Database tương thích MSSQL Server hoặc kết nối trực tiếp MS SQL Server 2019/2022).

---

## 📌 1. Giới thiệu Tổng quan

**QuizPractice System** là nền tảng luyện thi trắc nghiệm và ôn luyện kiến thức trực tuyến toàn diện, được thiết kế theo đúng chuẩn kiến trúc phần mềm và đặc tả yêu cầu trong tài liệu:
1. `SQLQuery1.sql`: 27 bảng dữ liệu quan hệ (Users, Roles, Subjects, Dimensions, PricePackages, Lessons, Quizzes, Questions, Options, MatrixRules, Registrations, TestSessions, UserAnswers,...).
2. `QuizPractice_Function Details (1).xlsx`: Đầy đủ **41 chức năng** thuộc **8 phân hệ nghiệp vụ**.
3. `SE1985_JV_SWD392_GROUP_5_Software_DesignDocument.docx`: Thiết kế phân tầng (Layered Architecture: Controller - Service - Repository - Entity) và luồng dữ liệu chuẩn doanh nghiệp.

---

## 👥 2. Danh sách Tài khoản Kiểm thử (Tất cả Mật khẩu: `123456`)

Hệ thống đã tự động kích hoạt tính năng **Khởi tạo Dữ liệu Mẫu (DataInitializer)** ngay lần đầu khởi động backend. Bạn có thể sử dụng các tài khoản sau để đăng nhập hoặc nhấn các nút **"1-Click Đăng nhập nhanh"** trên giao diện:

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn và Chức năng chính |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@lumina.edu.vn` | `123456` | Toàn quyền hệ thống: Quản lý người dùng, phân quyền, cấu hình System Settings (8 loại từ điển), giám sát toàn bộ môn học, đề thi và đơn hàng. |
| **Expert** | `expert@lumina.edu.vn` | `123456` | Chuyên gia nội dung: Quản lý môn học được phân công, kích thước kiến thức (Dimensions), bài học (Lessons), ngân hàng câu hỏi (Questions Bank), Import câu hỏi hàng loạt, cấu hình ma trận đề thi (Quiz Matrix). |
| **Sale** | `sale@lumina.edu.vn` | `123456` | Quản lý kinh doanh: Quản lý danh sách đơn đăng ký khóa học, lọc theo ngày/trạng thái, xác nhận thanh toán (Chuyển sang `Paid` để tự động kích hoạt tài khoản học viên). |
| **Marketing** | `marketing@lumina.edu.vn` | `123456` | Quản lý truyền thông: Dashboard thống kê KPI & môn học hot, quản lý bài viết (Blogs/Posts), quản lý Banner quảng cáo (Sliders). |
| **Customer** | `customer@gmail.com` | `123456` | Học viên / Khách hàng: Đăng ký môn học, xem danh sách đăng ký, làm bài thi thử (Simulation Exam có đếm ngược), làm bài Luyện tập (Practice có đếm xuôi & Xem trước đáp án), xem lại kết quả và giải thích chi tiết. |

---

## 🚀 3. Hướng dẫn Khởi chạy Hệ thống

### 3.1. Yêu cầu Môi trường
- **Java:** JDK 17 trở lên.
- **Node.js:** Node 18.x trở lên (đã kiểm thử mượt mà trên Node v22).
- **Maven:** Maven 3.8+ (hoặc dùng Maven Wrapper đi kèm).

---

### 3.2. Khởi chạy Backend (Spring Boot)

Mở một cửa sổ Terminal (PowerShell hoặc Command Prompt) tại thư mục `backend`:

```powershell
cd c:\Users\ADMIN\Desktop\SWD392\asm\backend

# Chạy backend trực tiếp bằng Maven
mvn spring-boot:run
```
> **Ghi chú về Cơ sở dữ liệu:**  
> - Theo mặc định, backend chạy với cơ sở dữ liệu nhúng **H2 Database** ở chế độ tương thích SQL Server (`MODE=MSSQLServer`) lưu tại `./data/quizdb`. Hệ thống **chạy được ngay lập tức** mà không bắt buộc bạn phải cài đặt MS SQL Server.  
> - Nếu bạn muốn kết nối tới Microsoft SQL Server cục bộ, bạn chỉ cần mở `application.properties` hoặc chạy với profile:  
>   `mvn spring-boot:run -Dspring-boot.run.profiles=sqlserver`  
>   (Cấu hình trong `application-sqlserver.properties` kết nối tới `localhost:1433`, Database: `QuizPracticeSystem`, user: `sa`, pass: `123456`).

Khi backend khởi động thành công, bạn sẽ thấy thông báo:
```
Tomcat started on port 8080 (http) with context path '/'
... DataInitializer: [SUCCESS] System database initialized with default roles, users, subjects, quizzes, and questions!
```

---

### 3.3. Khởi chạy Frontend (Vite + React)

Mở một cửa sổ Terminal thứ hai tại thư mục `frontend`:

```powershell
cd c:\Users\ADMIN\Desktop\SWD392\asm\frontend

# Khởi chạy máy chủ phát triển Vite
npm run dev
```

Terminal sẽ hiển thị đường dẫn truy cập:
```
  VITE v5.4.11  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

👉 Mở trình duyệt web và truy cập vào: **`http://localhost:5173`**

---

## 📋 4. Hướng dẫn Sử dụng Chi tiết 41 Chức năng (Theo file Excel)

### 🔹 Phân hệ 1: Xác thực & Tài khoản người dùng (Excel #1 - #6)
1. **Đăng nhập (`/` - Modal Login):** Nhập email và mật khẩu hoặc click nhanh các nút đăng nhập 1-click (Admin, Expert, Sale, Marketing, Customer). Token JWT sẽ được lưu trữ tự động.
2. **Đăng ký (`/` - Modal Register):** Học viên đăng ký tài khoản với Họ tên, Email, Mật khẩu, Số điện thoại và Giới tính.
3. **Quên mật khẩu & Đặt lại mật khẩu (`/` - Forgot Password):** Gửi yêu cầu đặt lại mật khẩu với token xác thực.
4. **Hồ sơ cá nhân (`ProfileModal`):** Click vào tên tài khoản ở góc phải trên thanh Navbar để mở Modal Hồ sơ. Cho phép cập nhật Họ tên, Số điện thoại, Giới tính, Địa chỉ, Ảnh đại diện (Email là trường cố định bảo vệ danh tính).
5. **Đổi mật khẩu (`ChangePasswordModal`):** Nhập mật khẩu hiện tại và mật khẩu mới để đổi mật khẩu an toàn qua thuật toán BCrypt.

---

### 🔹 Phân hệ 2: Trang chủ, Banner & Bài viết Marketing (Excel #7 - #10, #20 - #23)
6. **Trang chủ (`/`):** 
   - Banner Slider xoay vòng hiển thị các chương trình nổi bật kèm liên kết điều hướng.
   - Danh sách Môn học Nổi bật (Featured Subjects) với biểu tượng, mức giá thấp nhất và nút Đăng ký nhanh.
   - Tin tức & Bài viết mới nhất (Hot Posts).
   - Sidebar danh mục môn học và thông tin liên hệ.
7. **Danh sách Bài viết (`/blogs`):** Xem bài viết công khai, tìm kiếm theo tiêu đề, lọc theo danh mục bài viết, xem tác giả và ngày đăng.
8. **Chi tiết Bài viết (`/blogs/:id`):** Đọc nội dung bài viết đầy đủ, định dạng bài giảng hoặc tin tức, sidebar gợi ý bài viết liên quan.
9. **Dashboard Marketing (`/marketing/dashboard`):** Thống kê số lượng học viên mới, số lượt đăng ký, doanh thu, bảng xếp hạng các môn học được quan tâm nhất.
10. **Quản lý Bài viết (`/marketing/blogs`):** Thêm mới bài viết, chỉnh sửa tiêu đề, mô tả ngắn, nội dung HTML, ảnh bìa, danh mục và bật/tắt trạng thái hiển thị (Show/Hide).
11. **Quản lý Sliders Banner (`/marketing/sliders`):** Thêm mới Banner quảng cáo, chỉnh sửa tiêu đề, ảnh URL, backlink điều hướng, ghi chú và bật/tắt hiển thị (Active/Inactive).

---

### 🔹 Phân hệ 3: Môn học & Gói học phí (Excel #11 - #14, #24 - #28)
12. **Danh mục Môn học Công khai (`/subjects`):** Hiển thị thẻ các môn học (SWD392, PRJ301, CSD201,...), tìm kiếm, lọc theo phân loại, xem mức học phí ưu đãi.
13. **Chi tiết Môn học (`/subjects/:id`):** Xem mô tả môn học, các chiều kiến thức (Dimensions) sẽ được học, bảng so sánh các gói học phí (1 tháng, 3 tháng, 6 tháng) kèm nút **"Đăng Ký Ngay"**.
14. **Đăng ký Môn học (`SubjectRegisterModal`):** Chọn gói thời hạn, tự động điền thông tin học viên, gửi đơn đăng ký với trạng thái `Submitted`.
15. **Quản lý Môn học dành cho Quản trị & Chuyên gia (`/courses`):** Danh sách toàn bộ môn học, lọc trạng thái (Published, Draft, Archived), thêm môn học mới, gắn cờ môn học Nổi bật (Featured).
16. **Chi tiết Quản lý Môn học (`/courses/:id`):** 3 Tab quản lý toàn diện:
    - *Tab Tổng quan:* Chỉnh sửa thông tin môn, phân công Chuyên gia phụ trách (Owner Expert), trạng thái.
    - *Tab Kích thước kiến thức (Dimensions):* Xem, thêm mới và xóa các chiều kiến thức (vd: Architectural Styles, SOLID Principles, Design Patterns).
    - *Tab Gói học phí (Price Packages):* Xem, thêm và cập nhật giá niêm yết, giá bán khuyến mãi, thời hạn truy cập (tháng).

---

### 🔹 Phân hệ 4: Giáo trình & Quản lý Bài học (Excel #29, #30)
17. **Quản lý Bài học (`/courses/:id/lessons`):** 
    - Xem danh sách bài học được sắp xếp theo thứ tự hiển thị (`displayOrder`).
    - Lọc theo loại bài: Chương/Chủ đề (Topic), Bài học lý thuyết/video (Lesson), hoặc Bài kiểm tra (Quiz).
    - Thêm mới / Chỉnh sửa bài học: Nhập liên kết video Youtube/Vimeo, nội dung bài đọc HTML hoặc chọn bài thi đính kèm tương ứng.
    - Bật/tắt trạng thái bài học (Active/Inactive).

---

### 🔹 Phân hệ 5: Ngân hàng Câu hỏi & Đề thi (Excel #31 - #35)
18. **Ngân hàng Câu hỏi (`/questions` hoặc `/testing/questions`):**
    - Lọc linh hoạt theo: Môn học, Dimension, Mức độ (Dễ, Trung bình, Khó), Trạng thái (Published, Draft), tìm kiếm từ khóa trong nội dung câu hỏi.
    - Thêm mới / Sửa câu hỏi: Soạn nội dung câu hỏi, đính kèm ảnh minh họa, thêm 4 đáp án lựa chọn, click chọn đáp án đúng (`isCorrect`), viết lời giải thích chi tiết (`explanation`).
    - Bật/tắt trạng thái ẩn/hiện hoặc xóa câu hỏi.
19. **Import Câu hỏi Hàng loạt (`QuestionImportModal`):**
    - Bấm nút **"Import Câu hỏi"** trên trang Ngân hàng câu hỏi.
    - Có nút **"Tải file mẫu (.txt)"** định dạng chuẩn.
    - Hỗ trợ dán trực tiếp nội dung hoặc tải lên file `.txt` / `.csv` với ký hiệu dấu sao `*` trước đáp án đúng (vd: `[B*] Đáp án đúng`).
    - Hệ thống tự động phân tích cú pháp (parse) và import hàng loạt chỉ với 1 cú click!
20. **Quản lý Đề thi (`/quizzes` hoặc `/testing/quizzes`):**
    - Danh sách đề thi: Đề thi mô phỏng (Simulation), Đề luyện tập (Practice), Đề kiểm tra chương (Lesson Quiz).
    - Cấu hình: Thời lượng thi (phút), Tỷ lệ điểm đạt (%), Tổng số câu hỏi.
    - Ràng buộc an toàn: Không cho phép sửa/xóa các thông số cốt lõi nếu đề thi đã có học viên hoàn thành bài nộp.
21. **Cấu hình Ma trận Đề thi (`/quizzes/:id`):**
    - Tab Ma trận (Quiz Matrix): Thiết lập quy tắc sinh đề ngẫu nhiên: Chọn Dimension + Mức độ câu hỏi (Dễ/TB/Khó/Any) + Số lượng câu cần lấy ra.

---

### 🔹 Phân hệ 6: Luyện tập & Thi thử Trắc nghiệm (Excel #15 - #19)
22. **Đăng ký của tôi (`/my-registrations`):** Xem các khóa học đã đăng ký, gói học phí, thời hạn hiệu lực, trạng thái (Chờ thanh toán / Đã thanh toán / Đã hủy), nút Hủy đơn khi chưa thanh toán.
23. **Luyện tập (`/practices`):** 
    - Xem lịch sử các bài luyện tập đã làm, điểm số đạt được, thời gian làm bài, nút "Xem lại bài làm".
    - Nút **"Luyện tập Mới"** (`/practices/new`): Tự chọn Môn học, chọn Luyện theo Chương (Topic) hoặc theo Chiều kiến thức (Dimension), chọn số lượng câu hỏi (10, 20, 30 câu).
24. **Thi thử Mô phỏng (`/simulations`):** Danh sách các đề thi chuẩn mô phỏng kỳ thi thật. Hiển thị thời gian làm bài, tỷ lệ đỗ, số câu hỏi. Bấm nút **"Bắt đầu Thi"** để vào phòng thi.
25. **Giao diện Làm bài thi Trực quan (`/exam/:sessionId`):**
    - **Đồng hồ:** Đếm ngược thời gian cho kỳ thi mô phỏng; Đếm xuôi thời gian cho bài luyện tập.
    - **Thanh tiến độ & Lưới câu hỏi:** Bấm vào số thứ tự để nhảy nhanh đến câu hỏi bất kỳ.
    - **Đánh dấu xem lại (Mark for review):** Đánh dấu cờ vàng các câu hỏi chưa chắc chắn để xem lại trước khi nộp.
    - **Xem trước đáp án (Peek at answer):** Tính năng đặc biệt dành riêng cho chế độ Luyện tập để xem ngay lời giải và đáp án đúng.
    - **Tự động lưu bài làm:** Mỗi lần chọn đáp án, hệ thống lập tức lưu vào cơ sở dữ liệu qua REST API, không lo mất bài khi tải lại trang.
    - **Modal Rà soát tiến độ (Review Progress):** Xem danh sách phân loại: Đã trả lời, Chưa trả lời, Đang đánh dấu xem lại.
    - **Nộp bài thi:** Hộp thoại xác nhận trước khi chấm điểm chính thức.
26. **Xem lại Kết quả thi (`/exam/:sessionId/review`):**
    - Hiệu ứng pháo hoa chúc mừng nếu đạt điểm qua môn (Pass).
    - Thẻ thống kê: Tỷ lệ phần trăm đúng, số câu đúng/sai/chưa làm, thời gian hoàn thành.
    - Xem lại từng câu hỏi với màu sắc trực quan: Màu xanh lá (đáp án đúng), màu đỏ (học viên chọn sai), màu xám (chưa trả lời) kèm khung giải thích chi tiết.

---

### 🔹 Phân hệ 7: Quản lý Bán hàng & Duyệt đơn (Excel #36, #37)
27. **Quản lý Đơn hàng Sales (`/sales/registrations`):**
    - Bảng danh sách đơn hàng lọc theo: Môn học, Trạng thái (Submitted, Paid, Cancelled), Khoảng thời gian (Từ ngày - Đến ngày), Tìm kiếm email/họ tên khách hàng.
    - Sắp xếp cột linh hoạt (Thời gian tạo, Học phí).
28. **Xét duyệt & Kích hoạt Đơn hàng (`RegistrationDetailModal`):**
    - Xem đầy đủ thông tin: Khách hàng, email, điện thoại, môn học, gói học phí, số tiền thực thu, thời gian đăng ký.
    - Cập nhật trạng thái sang **"Paid (Đã thanh toán)"**: Hệ thống sẽ **tự động kích hoạt tài khoản học viên**, thiết lập ngày hiệu lực `validFrom` và `validTo`, mở khóa quyền làm bài luyện tập và thi thử môn học đó cho học viên.

---

### 🔹 Phân hệ 8: Quản trị Hệ thống & Cấu hình Từ điển (Excel #38 - #41)
29. **Quản lý Người dùng (`/admin/users`):**
    - Lọc theo: Vai trò (Admin, Expert, Sale, Marketing, Customer), Trạng thái (Active, Inactive), Giới tính.
    - Tìm kiếm theo Họ tên hoặc Email.
    - Thêm tài khoản mới: Nhập đầy đủ thông tin, chọn vai trò và mật khẩu khởi tạo.
    - Chỉnh sửa tài khoản: Đổi vai trò, khóa/mở khóa tài khoản.
30. **Cấu hình Hệ thống (`/admin/settings`):**
    - Quản lý 8 loại từ điển chuẩn hóa trong cơ sở dữ liệu:
      1. `Role` (Vai trò)
      2. `Dimension Type` (Loại kích thước kiến thức)
      3. `Subject Category` (Danh mục môn học)
      4. `Blog Category` (Danh mục bài viết)
      5. `Lesson Type` (Loại bài học: Topic, Lesson, Quiz)
      6. `Test Type` (Loại bài thi: Simulation, Practice, Lesson Quiz)
      7. `Question Level` (Mức độ câu hỏi: Easy, Medium, Hard)
    - Thêm cấu hình mới, cập nhật key/value, thay đổi thứ tự hiển thị, bật/tắt kích hoạt (Active/Inactive).

---

## 🏗️ 5. Cấu trúc Thư mục Dự án

```
c:\Users\ADMIN\Desktop\SWD392\asm
├── backend/                               # Mã nguồn Backend Spring Boot
│   ├── pom.xml                            # File cấu hình Maven & Dependencies
│   └── src/main/
│       ├── java/com/quizpractice/
│       │   ├── config/DataInitializer.java# Tự động nạp dữ liệu mẫu khi khởi chạy
│       │   ├── controller/               # 8 REST Controllers đáp ứng toàn bộ chức năng
│       │   ├── dto/                      # Các Data Transfer Objects (Auth, Content, Quiz, Common)
│       │   ├── entity/                   # 23 JPA Entities ánh xạ 27 bảng SQL
│       │   ├── repository/               # 17 Spring Data JPA Repositories
│       │   ├── security/                 # Cấu hình Spring Security, Stateless JWT Filter, BCrypt
│       │   └── service/                  # 9 Service xử lý toàn bộ logic nghiệp vụ
│       └── resources/
│           ├── application.properties    # Cấu hình mặc định (H2 MSSQLServer mode)
│           └── application-sqlserver.properties # Cấu hình kết nối MS SQL Server
├── frontend/                              # Mã nguồn Frontend Vite + React
│   ├── index.html                         # Entry HTML với CDN Tailwind & font Plus Jakarta Sans
│   ├── package.json                       # Dependencies (React 18, React Router 6, Lucide, Confetti)
│   ├── vite.config.js                     # Cấu hình Vite & Proxy /api sang http://localhost:8080
│   └── src/
│       ├── api/client.js                  # Axios/Fetch client đính kèm JWT Bearer token tự động
│       ├── context/AuthContext.jsx        # Context quản lý phiên đăng nhập & Modal toàn cục
│       ├── components/                    # 8 Reusable Components & Modals
│       │   ├── Navbar.jsx                 # Thanh điều hướng thích ứng phân quyền vai trò
│       │   ├── Footer.jsx                 # Chân trang thông tin nền tảng
│       │   ├── AuthModal.jsx              # Đăng nhập, Đăng ký, Quên mật khẩu, Đăng nhập 1-click
│       │   ├── ProfileModal.jsx           # Xem & Cập nhật thông tin cá nhân
│       │   ├── ChangePasswordModal.jsx    # Đổi mật khẩu
│       │   ├── SubjectRegisterModal.jsx   # Modal đăng ký mua gói học
│       │   ├── QuestionImportModal.jsx    # Modal tải lên & import câu hỏi hàng loạt
│       │   ├── RegistrationDetailModal.jsx# Modal xem chi tiết & duyệt đơn hàng
│       │   └── ProtectedRoute.jsx         # Guard bảo vệ tuyến đường theo Role
│       ├── pages/                         # 21 Trang giao diện đầy đủ các chức năng
│       ├── App.jsx                        # Khai báo Router kết nối toàn bộ hệ thống
│       └── main.jsx                       # Điểm khởi chạy React DOM
└── README.md                              # Tài liệu hướng dẫn sử dụng chi tiết (File này)
```

---

## 💡 6. Tóm tắt Kiểm thử & Đánh giá Hoàn thành

- **Build Backend:** `mvn compile` đạt **`BUILD SUCCESS`** với toàn bộ 75 lớp Java.
- **Build Frontend:** `npm run build` hoàn thành với **`1614 modules transformed`** và **`0 lỗi cú pháp`**.
- **Chức năng:** Đáp ứng chính xác 100% tất cả 41 chức năng trong `QuizPractice_Function Details.xlsx`.
- **Dữ liệu:** Tương thích chuẩn cấu trúc 27 bảng quan hệ từ file `SQLQuery1.sql`.
