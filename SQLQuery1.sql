-- =========================================================================
-- TẠO DATABASE
-- =========================================================================
CREATE DATABASE QuizPracticeSystem;
GO

USE QuizPracticeSystem;
GO

-- =========================================================================
-- LEVEL 0: CÁC BẢNG KHÔNG PHỤ THUỘC (TẠO TRƯỚC)
-- =========================================================================

CREATE TABLE Roles (
    role_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    role_name VARCHAR(30) NOT NULL UNIQUE,
    description NVARCHAR(255) NULL,
    status BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE System_Settings (
    setting_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    [type] VARCHAR(30) NOT NULL,
    value NVARCHAR(100) NOT NULL,
    order_no INT NOT NULL DEFAULT 0,
    description NVARCHAR(500) NULL,
    status VARCHAR(10) NOT NULL,
    CONSTRAINT UQ_System_Settings UNIQUE ([type], value)
);

CREATE TABLE Subject_Categories (
    category_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL,
    status BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Blog_Categories (
    category_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL,
    status BIT NOT NULL DEFAULT 1
);

-- =========================================================================
-- LEVEL 1: BẢNG NGƯỜI DÙNG
-- =========================================================================

CREATE TABLE Users (
    user_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) NULL,
    address NVARCHAR(255) NULL,
    role_id BIGINT NOT NULL FOREIGN KEY REFERENCES Roles(role_id),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- LEVEL 2: CÁC BẢNG LIÊN QUAN TRỰC TIẾP ĐẾN USER & CATEGORY
-- =========================================================================

CREATE TABLE Auth_Providers (
    auth_provider_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id) ON DELETE CASCADE,
    provider_name VARCHAR(20) NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,
    provider_email VARCHAR(100) NULL,
    linked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_Auth_Providers UNIQUE (provider_name, provider_user_id)
);

CREATE TABLE OTP_Codes (
    otp_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    purpose VARCHAR(20) NOT NULL,
    code_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Role_Menus (
    role_menu_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    role_id BIGINT NOT NULL FOREIGN KEY REFERENCES Roles(role_id),
    menu_setting_id BIGINT NOT NULL FOREIGN KEY REFERENCES System_Settings(setting_id),
    CONSTRAINT UQ_Role_Menus UNIQUE (role_id, menu_setting_id)
);

CREATE TABLE Audit_Logs (
    log_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    action VARCHAR(40) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id BIGINT NULL,
    old_value NVARCHAR(MAX) NULL,
    new_value NVARCHAR(MAX) NULL,
    ip_address VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Sliders (
    slider_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(200) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    backlink VARCHAR(500) NULL,
    status VARCHAR(10) NOT NULL,
    notes NVARCHAR(500) NULL,
    created_by BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Blogs (
    blog_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    category_id BIGINT NOT NULL FOREIGN KEY REFERENCES Blog_Categories(category_id),
    author_id BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    title NVARCHAR(200) NOT NULL,
    thumbnail_url VARCHAR(255) NULL,
    brief_info NVARCHAR(500) NULL,
    content NVARCHAR(MAX) NOT NULL,
    is_featured BIT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'Hidden',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Subjects (
    subject_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    subject_name NVARCHAR(150) NOT NULL UNIQUE,
    category_id BIGINT NOT NULL FOREIGN KEY REFERENCES Subject_Categories(category_id),
    owner_id BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    thumbnail_url VARCHAR(255) NULL,
    tag_line NVARCHAR(200) NULL,
    brief_info NVARCHAR(500) NULL,
    description NVARCHAR(MAX) NULL,
    is_featured BIT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'Unpublished',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT NULL FOREIGN KEY REFERENCES Users(user_id)
);

-- =========================================================================
-- LEVEL 3: THÀNH PHẦN CỦA MÔN HỌC (DIMENSION, PRICE PACKAGES)
-- =========================================================================

CREATE TABLE Subject_Dimensions (
    dimension_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    subject_id BIGINT NOT NULL FOREIGN KEY REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    dimension_type_id BIGINT NOT NULL FOREIGN KEY REFERENCES System_Settings(setting_id),
    dimension_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500) NULL,
    CONSTRAINT UQ_Subject_Dimensions UNIQUE (subject_id, dimension_type_id, dimension_name)
);

CREATE TABLE Price_Packages (
    package_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    subject_id BIGINT NOT NULL FOREIGN KEY REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    package_name NVARCHAR(100) NOT NULL,
    access_duration_months INT NOT NULL CHECK (access_duration_months > 0),
    list_price DECIMAL(12,2) NOT NULL CHECK (list_price >= 0),
    sale_price DECIMAL(12,2) NOT NULL CHECK (sale_price >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    description NVARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_Price_Packages UNIQUE (subject_id, package_name),
    CONSTRAINT CHK_Sale_Price CHECK (sale_price <= list_price)
);

-- =========================================================================
-- LEVEL 4: CẤU HÌNH ĐỀ THI (QUIZZES) & LESSONS
-- =========================================================================

CREATE TABLE Quizzes (
    quiz_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    subject_id BIGINT NOT NULL FOREIGN KEY REFERENCES Subjects(subject_id),
    quiz_name NVARCHAR(255) NOT NULL,
    test_type VARCHAR(50) NOT NULL DEFAULT 'Simulation',
    level VARCHAR(20) NOT NULL DEFAULT 'Medium',
    duration INT NOT NULL DEFAULT 60,
    pass_rate DECIMAL(5,2) NOT NULL DEFAULT 70.00,
    total_questions INT NOT NULL DEFAULT 0,
    is_random BIT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft',
    description NVARCHAR(MAX) NULL,
    created_by BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
);

CREATE TABLE Lessons (
    lesson_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    subject_id BIGINT NOT NULL FOREIGN KEY REFERENCES Subjects(subject_id),
    package_id BIGINT NOT NULL FOREIGN KEY REFERENCES Price_Packages(package_id),
    lesson_name NVARCHAR(200) NOT NULL,
    lesson_type_id BIGINT NOT NULL FOREIGN KEY REFERENCES System_Settings(setting_id),
    display_order INT NOT NULL DEFAULT 0,
    video_link VARCHAR(500) NULL,
    html_content NVARCHAR(MAX) NULL,
    quiz_id BIGINT NULL FOREIGN KEY REFERENCES Quizzes(quiz_id),
    status BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- LEVEL 5: NGÂN HÀNG CÂU HỎI
-- =========================================================================

CREATE TABLE Questions (
    question_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    subject_id BIGINT NOT NULL FOREIGN KEY REFERENCES Subjects(subject_id),
    dimension_id BIGINT NULL FOREIGN KEY REFERENCES Subject_Dimensions(dimension_id),
    lesson_id BIGINT NULL FOREIGN KEY REFERENCES Lessons(lesson_id),
    content NVARCHAR(MAX) NOT NULL,
    level VARCHAR(20) NOT NULL DEFAULT 'Medium',
    status VARCHAR(20) NOT NULL DEFAULT 'Draft',
    explanation NVARCHAR(MAX) NULL,
    created_by BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
);

-- =========================================================================
-- LEVEL 6: CHI TIẾT CÂU HỎI & CẤU TRÚC QUIZ
-- =========================================================================

CREATE TABLE Question_Options (
    option_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    question_id BIGINT NOT NULL FOREIGN KEY REFERENCES Questions(question_id) ON DELETE CASCADE,
    option_text NVARCHAR(MAX) NOT NULL,
    is_correct BIT NOT NULL DEFAULT 0,
    explanation NVARCHAR(MAX) NULL,
    order_index INT NOT NULL DEFAULT 1
);

CREATE TABLE Question_Media (
    media_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    question_id BIGINT NOT NULL FOREIGN KEY REFERENCES Questions(question_id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL,
    media_url VARCHAR(500) NOT NULL,
    description NVARCHAR(255) NULL,
    order_index INT NOT NULL DEFAULT 1
);

CREATE TABLE Quiz_Questions_Mapping (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    quiz_id BIGINT NOT NULL FOREIGN KEY REFERENCES Quizzes(quiz_id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL FOREIGN KEY REFERENCES Questions(question_id),
    order_index INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Quiz_Matrix_Rules (
    rule_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    quiz_id BIGINT NOT NULL FOREIGN KEY REFERENCES Quizzes(quiz_id) ON DELETE CASCADE,
    dimension_id BIGINT NULL FOREIGN KEY REFERENCES Subject_Dimensions(dimension_id),
    lesson_id BIGINT NULL FOREIGN KEY REFERENCES Lessons(lesson_id),
    question_level VARCHAR(20) NULL DEFAULT 'Any',
    number_of_questions INT NOT NULL DEFAULT 1
);

-- =========================================================================
-- LEVEL 7: ĐĂNG KÝ MÔN HỌC & LUYỆN TẬP
-- =========================================================================

-- Tổng hợp yêu cầu từ Bảng User_Registrations và Bảng Registrations (Orders)
CREATE TABLE User_Registrations (
    registration_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NULL FOREIGN KEY REFERENCES Users(user_id),
    subject_id BIGINT NOT NULL FOREIGN KEY REFERENCES Subjects(subject_id),
    package_id BIGINT NOT NULL FOREIGN KEY REFERENCES Price_Packages(package_id),
    full_name NVARCHAR(150) NOT NULL,
    gender VARCHAR(20) NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NULL,
    registration_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_cost DECIMAL(12,2) NOT NULL CHECK (total_cost >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'Submitted',
    valid_from DATE NULL,
    valid_to DATE NULL,
    notes NVARCHAR(500) NULL,
    updated_by BIGINT NULL FOREIGN KEY REFERENCES Users(user_id),
    updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Practice_Tests (
    practice_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    subject_id BIGINT NOT NULL FOREIGN KEY REFERENCES Subjects(subject_id),
    topic_id BIGINT NULL FOREIGN KEY REFERENCES Lessons(lesson_id),
    dimension_id BIGINT NULL FOREIGN KEY REFERENCES Subject_Dimensions(dimension_id),
    question_count INT NOT NULL CHECK (question_count > 0),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'Created',
    question_level VARCHAR(20) NULL
);

-- =========================================================================
-- LEVEL 8: THANH TOÁN (PAYMENTS) & PHIÊN LÀM BÀI (TEST SESSIONS)
-- =========================================================================

CREATE TABLE Payments (
    payment_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    registration_id BIGINT NOT NULL FOREIGN KEY REFERENCES User_Registrations(registration_id),
    amount DECIMAL(12,2) NOT NULL,
    method VARCHAR(30) NOT NULL,
    transaction_code VARCHAR(100) NULL UNIQUE,
    status VARCHAR(20) NOT NULL,
    paid_at DATETIME NULL,
    created_by BIGINT NULL FOREIGN KEY REFERENCES Users(user_id)
);

CREATE TABLE Test_Sessions (
    session_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    test_type VARCHAR(20) NOT NULL,
    practice_id BIGINT NULL FOREIGN KEY REFERENCES Practice_Tests(practice_id),
    exam_id BIGINT NULL FOREIGN KEY REFERENCES Quizzes(quiz_id),
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL,
    submitted_at DATETIME NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'InProgress',
    current_question_no INT NULL DEFAULT 1,
    duration_seconds INT NULL,
    question_order_snapshot NVARCHAR(MAX) NULL
);

-- =========================================================================
-- LEVEL 9: KẾT QUẢ VÀ ĐÁP ÁN (EXAM RESULTS & USER ANSWERS)
-- =========================================================================

CREATE TABLE User_Answers (
    user_answer_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    session_id BIGINT NOT NULL FOREIGN KEY REFERENCES Test_Sessions(session_id),
    question_id BIGINT NOT NULL FOREIGN KEY REFERENCES Questions(question_id),
    selected_option_id BIGINT NULL FOREIGN KEY REFERENCES Question_Options(option_id),
    is_marked BIT NOT NULL DEFAULT 0,
    answered_at DATETIME NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_User_Answers UNIQUE (session_id, question_id)
);

CREATE TABLE Exam_Results (
    result_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    session_id BIGINT NOT NULL UNIQUE FOREIGN KEY REFERENCES Test_Sessions(session_id),
    user_id BIGINT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    total_questions INT NOT NULL,
    answered_count INT NOT NULL DEFAULT 0,
    correct_count INT NOT NULL DEFAULT 0,
    incorrect_count INT NOT NULL DEFAULT 0,
    unanswered_count INT NOT NULL DEFAULT 0,
    score DECIMAL(6,2) NOT NULL DEFAULT 0,
    is_passed BIT NULL,
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT CHK_Total_Questions CHECK (total_questions = answered_count + unanswered_count),
    CONSTRAINT CHK_Answered_Count CHECK (answered_count = correct_count + incorrect_count),
    CONSTRAINT CHK_NonNegative_Counts CHECK (
        total_questions >= 0 AND 
        answered_count >= 0 AND 
        correct_count >= 0 AND 
        incorrect_count >= 0 AND 
        unanswered_count >= 0
    )
);
GO