package com.quizpractice.config;

import com.quizpractice.entity.*;
import com.quizpractice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SystemSettingRepository settingRepository;

    @Autowired
    private SubjectCategoryRepository subjectCategoryRepository;

    @Autowired
    private BlogCategoryRepository blogCategoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SliderRepository sliderRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SubjectDimensionRepository dimensionRepository;

    @Autowired
    private PricePackageRepository packageRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionOptionRepository optionRepository;

    @Autowired
    private QuizQuestionMappingRepository mappingRepository;

    @Autowired
    private UserRegistrationRepository registrationRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PracticeTestRepository practiceRepository;

    @Autowired
    private TestSessionRepository sessionRepository;

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (roleRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println(">>> Initializing Quiz Practice System Seed Data...");

        // 1. Roles
        Role adminRole = roleRepository.save(new Role("ADMIN", "System Administrator with full access"));
        Role expertRole = roleRepository.save(new Role("EXPERT", "Course & Test Content Expert"));
        Role saleRole = roleRepository.save(new Role("SALE", "Sales representative managing orders"));
        Role marketingRole = roleRepository.save(new Role("MARKETING", "Marketing officer managing blogs & banners"));
        Role customerRole = roleRepository.save(new Role("CUSTOMER", "Standard customer / student user"));

        // 2. System Settings
        // User Roles
        settingRepository.save(new SystemSetting("User Roles", "ADMIN", 1, "System Admin", "Active"));
        settingRepository.save(new SystemSetting("User Roles", "EXPERT", 2, "Content Expert", "Active"));
        settingRepository.save(new SystemSetting("User Roles", "SALE", 3, "Sales Staff", "Active"));
        settingRepository.save(new SystemSetting("User Roles", "MARKETING", 4, "Marketing Staff", "Active"));
        settingRepository.save(new SystemSetting("User Roles", "CUSTOMER", 5, "Customer Learner", "Active"));

        // System Menu
        settingRepository.save(new SystemSetting("System Menu", "Home", 1, "Public Home Screen", "Active"));
        settingRepository.save(new SystemSetting("System Menu", "Blogs", 2, "Public Blogs & News", "Active"));
        settingRepository.save(new SystemSetting("System Menu", "Subjects", 3, "Course Catalog", "Active"));
        settingRepository.save(new SystemSetting("System Menu", "Practices", 4, "Customer Practice Portal", "Active"));
        settingRepository.save(new SystemSetting("System Menu", "Simulation", 5, "Simulation Exams", "Active"));

        // Post Categories
        settingRepository.save(new SystemSetting("Post Categories", "Exam Tips", 1, "Tips and guidelines for exams", "Active"));
        settingRepository.save(new SystemSetting("Post Categories", "Architecture Guides", 2, "Software architecture tutorials", "Active"));
        settingRepository.save(new SystemSetting("Post Categories", "Study News", 3, "Curriculum updates", "Active"));

        // Subject Categories
        settingRepository.save(new SystemSetting("Subject Categories", "Software Engineering", 1, "Software Engineering Courses", "Active"));
        settingRepository.save(new SystemSetting("Subject Categories", "Cloud & DevOps", 2, "Cloud & Infrastructure", "Active"));
        settingRepository.save(new SystemSetting("Subject Categories", "Data & Algorithms", 3, "Data Structures and CS", "Active"));

        // Test Types
        settingRepository.save(new SystemSetting("Test Types", "Simulation", 1, "Simulation Exam with Countdown", "Active"));
        settingRepository.save(new SystemSetting("Test Types", "Lesson-Quiz", 2, "Practice Test with Peek Answer", "Active"));

        // Question Levels
        settingRepository.save(new SystemSetting("Question Levels", "Easy", 1, "Basic Recall & Understanding", "Active"));
        settingRepository.save(new SystemSetting("Question Levels", "Medium", 2, "Application & Problem Analysis", "Active"));
        settingRepository.save(new SystemSetting("Question Levels", "Hard", 3, "Complex Synthesis & Evaluation", "Active"));

        // Lesson Types
        SystemSetting stTopic = settingRepository.save(new SystemSetting("Lesson Types", "Subject Topic", 1, "Chapter or Topic Container", "Active"));
        SystemSetting stLesson = settingRepository.save(new SystemSetting("Lesson Types", "Lesson", 2, "Standard Article/Video Lesson", "Active"));
        SystemSetting stQuiz = settingRepository.save(new SystemSetting("Lesson Types", "Quiz", 3, "Knowledge Assessment Quiz", "Active"));

        // Subject Dimension
        SystemSetting dimDomain = settingRepository.save(new SystemSetting("Subject Dimension", "Domain", 1, "Knowledge Domain Dimension", "Active"));
        SystemSetting dimGroup = settingRepository.save(new SystemSetting("Subject Dimension", "Group", 2, "Skill Group Dimension", "Active"));

        // 3. Subject & Blog Categories
        SubjectCategory catSE = subjectCategoryRepository.save(new SubjectCategory("Software Engineering", "Software architecture, design principles, and patterns"));
        SubjectCategory catCloud = subjectCategoryRepository.save(new SubjectCategory("Cloud & DevOps", "CI/CD, containerization, and cloud deployment"));
        SubjectCategory catDS = subjectCategoryRepository.save(new SubjectCategory("Data Science & CS", "Algorithms, computational thinking, and data analysis"));

        BlogCategory bCatExam = blogCategoryRepository.save(new BlogCategory("Exam Strategies", "Proven strategies for passing technical certification exams"));
        BlogCategory bCatArch = blogCategoryRepository.save(new BlogCategory("Architecture Trends", "Modern software architecture designs & best practices"));
        BlogCategory bCatGeneral = blogCategoryRepository.save(new BlogCategory("Learning Guides", "Tips for effective study habits and retention"));

        // 4. Users (Password: 123456 for all)
        String passHash = passwordEncoder.encode("123456");

        User adminUser = new User();
        adminUser.setEmail("admin@lumina.edu.vn");
        adminUser.setPasswordHash(passHash);
        adminUser.setFullName("System Admin");
        adminUser.setRole(adminRole);
        adminUser.setGender("Male");
        adminUser.setMobile("0901234567");
        adminUser.setAddress("FPT University, Hoa Lac High-Tech Park, Hanoi");
        adminUser.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        adminUser.setStatus("Active");
        adminUser = userRepository.save(adminUser);

        User expertUser = new User();
        expertUser.setEmail("expert@lumina.edu.vn");
        expertUser.setPasswordHash(passHash);
        expertUser.setFullName("Dr. Nguyen Expert");
        expertUser.setRole(expertRole);
        expertUser.setGender("Male");
        expertUser.setMobile("0912345678");
        expertUser.setAddress("Software Engineering Dept, Hanoi");
        expertUser.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150");
        expertUser.setStatus("Active");
        expertUser = userRepository.save(expertUser);

        User saleUser = new User();
        saleUser.setEmail("sale@lumina.edu.vn");
        saleUser.setPasswordHash(passHash);
        saleUser.setFullName("Le Van Sale");
        saleUser.setRole(saleRole);
        saleUser.setGender("Male");
        saleUser.setMobile("0987654321");
        saleUser.setAddress("Cau Giay, Hanoi");
        saleUser.setAvatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150");
        saleUser.setStatus("Active");
        saleUser = userRepository.save(saleUser);

        User marketingUser = new User();
        marketingUser.setEmail("marketing@lumina.edu.vn");
        marketingUser.setPasswordHash(passHash);
        marketingUser.setFullName("Tran Thi Marketing");
        marketingUser.setRole(marketingRole);
        marketingUser.setGender("Female");
        marketingUser.setMobile("0978123456");
        marketingUser.setAddress("Ba Dinh, Hanoi");
        marketingUser.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150");
        marketingUser.setStatus("Active");
        marketingUser = userRepository.save(marketingUser);

        User customerUser = new User();
        customerUser.setEmail("customer@gmail.com");
        customerUser.setPasswordHash(passHash);
        customerUser.setFullName("Hoang Student");
        customerUser.setRole(customerRole);
        customerUser.setGender("Male");
        customerUser.setMobile("0965123987");
        customerUser.setAddress("My Dinh, Hanoi");
        customerUser.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
        customerUser.setStatus("Active");
        customerUser = userRepository.save(customerUser);

        // 5. Sliders
        Slider s1 = new Slider();
        s1.setTitle("Luyện Thi SWD392 - Kiến Trúc Phần Mềm Chuẩn FPT 2026");
        s1.setImageUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=450&fit=crop");
        s1.setBacklink("/subjects");
        s1.setStatus("Show");
        s1.setNotes("Banner trang chủ nổi bật");
        s1.setCreatedBy(marketingUser);
        sliderRepository.save(s1);

        Slider s2 = new Slider();
        s2.setTitle("Bộ Đề Simulation Exam & Ngân Hàng Câu Hỏi Chuẩn Quốc Tế");
        s2.setImageUrl("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=450&fit=crop");
        s2.setBacklink("/simulation");
        s2.setStatus("Show");
        s2.setNotes("Quảng bá thi thử mô phỏng");
        s2.setCreatedBy(marketingUser);
        sliderRepository.save(s2);

        Slider s3 = new Slider();
        s3.setTitle("Thực Hành Trực Quan với Giải Thích Chi Tiết Từng Câu Hỏi");
        s3.setImageUrl("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=450&fit=crop");
        s3.setBacklink("/practices");
        s3.setStatus("Show");
        s3.setNotes("Giới thiệu tính năng Peek at Answer");
        s3.setCreatedBy(marketingUser);
        sliderRepository.save(s3);

        // 6. Blogs
        Blog b1 = new Blog();
        b1.setTitle("Bí quyết đạt điểm cao trong kỳ thi SWD392 Kiến Trúc & Thiết Kế Phần Mềm");
        b1.setCategory(bCatExam);
        b1.setAuthor(expertUser);
        b1.setThumbnailUrl("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop");
        b1.setBriefInfo("Tổng hợp các lưu ý quan trọng về Clean Architecture, Design Patterns và cách giải quyết các câu hỏi tình huống.");
        b1.setContent("<p>Môn học <strong>SWD392 (Software Architecture and Design)</strong> đòi hỏi sinh viên không chỉ nắm vững lý thuyết mà còn biết cách áp dụng kiến trúc phần mềm vào các tình huống thực tế...</p><p>Hãy chú ý các khái niệm cốt lõi: Clean Architecture, Microservices patterns, RESTful API design và SOLID principles.</p>");
        b1.setIsFeatured(true);
        b1.setStatus("Show");
        blogRepository.save(b1);

        Blog b2 = new Blog();
        b2.setTitle("So sánh Clean Architecture và Microservices trong phát triển phần mềm hiện đại");
        b2.setCategory(bCatArch);
        b2.setAuthor(expertUser);
        b2.setThumbnailUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop");
        b2.setBriefInfo("Phân tích ưu nhược điểm, khi nào nên chọn Monolithic Clean Architecture và khi nào chuyển dịch sang Microservices.");
        b2.setContent("<p>Clean Architecture giúp tách biệt business rules cốt lõi khỏi database và framework, trong khi Microservices tối ưu khả năng mở rộng độc lập của các service...</p>");
        b2.setIsFeatured(true);
        b2.setStatus("Show");
        blogRepository.save(b2);

        Blog b3 = new Blog();
        b3.setTitle("Cách ôn thi trắc nghiệm hiệu quả với phương pháp Spaced Repetition");
        b3.setCategory(bCatGeneral);
        b3.setAuthor(marketingUser);
        b3.setThumbnailUrl("https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop");
        b3.setBriefInfo("Ứng dụng phương pháp lặp lại ngắt quãng để ghi nhớ lâu hơn hàng trăm câu hỏi trắc nghiệm kỹ thuật.");
        b3.setContent("<p>Thay vì nhồi nhét trước ngày thi, hãy chia nhỏ ngân hàng câu hỏi và luyện tập lặp lại sau 1 ngày, 3 ngày và 7 ngày...</p>");
        b3.setIsFeatured(false);
        b3.setStatus("Show");
        blogRepository.save(b3);

        // 7. Subjects
        Subject subSWD = new Subject();
        subSWD.setSubjectName("SWD392 - Software Architecture and Design");
        subSWD.setCategory(catSE);
        subSWD.setOwner(expertUser);
        subSWD.setThumbnailUrl("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop");
        subSWD.setTagLine("Khóa học & Luyện thi trắc nghiệm Kiến trúc phần mềm chuẩn quốc tế");
        subSWD.setBriefInfo("Bao quát toàn diện các kiến trúc Monolith, Clean Architecture, Microservices, Design Patterns và kiểm thử chất lượng hệ thống.");
        subSWD.setDescription("Khóa học SWD392 được biên soạn bởi giảng viên giàu kinh nghiệm, cung cấp hơn 100+ câu hỏi thi thử mô phỏng sát với đề thi thực tế tại các trường đại học hàng đầu.");
        subSWD.setIsFeatured(true);
        subSWD.setStatus("Published");
        subSWD = subjectRepository.save(subSWD);

        Subject subPRJ = new Subject();
        subPRJ.setSubjectName("PRJ301 - Java Web Development with Spring Boot");
        subPRJ.setCategory(catSE);
        subPRJ.setOwner(expertUser);
        subPRJ.setThumbnailUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop");
        subPRJ.setTagLine("Làm chủ Java Web, Servlet/JSP, Spring Framework và REST API");
        subPRJ.setBriefInfo("Trang bị kiến thức phát triển backend chuyên nghiệp với Java, JPA Hibernate và hệ sinh thái Spring Boot.");
        subPRJ.setDescription("Bộ ngân hàng câu hỏi kiểm tra kỹ năng lập trình Java Web từ cơ bản đến nâng cao, đi kèm các bài tập tình huống thực tế.");
        subPRJ.setIsFeatured(true);
        subPRJ.setStatus("Published");
        subPRJ = subjectRepository.save(subPRJ);

        Subject subCSD = new Subject();
        subCSD.setSubjectName("CSD201 - Data Structures and Algorithms");
        subCSD.setCategory(catDS);
        subCSD.setOwner(expertUser);
        subCSD.setThumbnailUrl("https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop");
        subCSD.setTagLine("Luyện tập thuật toán, cấu trúc dữ liệu và tư duy tối ưu mã nguồn");
        subCSD.setBriefInfo("Bao gồm Array, Linked List, Stack, Queue, Tree (BST, AVL), Graph và các thuật toán sắp xếp.");
        subCSD.setDescription("Khóa học giúp củng cố nền tảng khoa học máy tính cốt lõi cho các kỳ thi chứng chỉ và phỏng vấn kỹ thuật.");
        subCSD.setIsFeatured(false);
        subCSD.setStatus("Published");
        subCSD = subjectRepository.save(subCSD);

        // 8. Dimensions for SWD392
        SubjectDimension dimDomainArch = new SubjectDimension();
        dimDomainArch.setSubject(subSWD);
        dimDomainArch.setDimensionType(dimDomain);
        dimDomainArch.setDimensionName("Architecture Patterns");
        dimDomainArch.setDescription("Kiến trúc Layered, Clean Architecture, Microservices");
        dimDomainArch = dimensionRepository.save(dimDomainArch);

        SubjectDimension dimDomainPatterns = new SubjectDimension();
        dimDomainPatterns.setSubject(subSWD);
        dimDomainPatterns.setDimensionType(dimDomain);
        dimDomainPatterns.setDimensionName("Design Patterns");
        dimDomainPatterns.setDescription("Creational, Structural, Behavioral Patterns");
        dimDomainPatterns = dimensionRepository.save(dimDomainPatterns);

        SubjectDimension dimGroupReq = new SubjectDimension();
        dimGroupReq.setSubject(subSWD);
        dimGroupReq.setDimensionType(dimGroup);
        dimGroupReq.setDimensionName("Quality Attributes");
        dimGroupReq.setDescription("Performance, Security, Scalability, Modifiability");
        dimGroupReq = dimensionRepository.save(dimGroupReq);

        // 9. Price Packages for SWD392
        PricePackage pkg1 = new PricePackage();
        pkg1.setSubject(subSWD);
        pkg1.setPackageName("Gói Cơ Bản (1 Tháng)");
        pkg1.setAccessDurationMonths(1);
        pkg1.setListPrice(new BigDecimal("490000"));
        pkg1.setSalePrice(new BigDecimal("350000"));
        pkg1.setStatus("Active");
        pkg1.setDescription("Truy cập toàn bộ câu hỏi và 3 đề thi thử mô phỏng trong 30 ngày");
        pkg1 = packageRepository.save(pkg1);

        PricePackage pkg3 = new PricePackage();
        pkg3.setSubject(subSWD);
        pkg3.setPackageName("Gói Tiêu Chuẩn (3 Tháng)");
        pkg3.setAccessDurationMonths(3);
        pkg3.setListPrice(new BigDecimal("1200000"));
        pkg3.setSalePrice(new BigDecimal("890000"));
        pkg3.setStatus("Active");
        pkg3.setDescription("Luyện tập không giới hạn toàn bộ ngân hàng câu hỏi, video bài giảng và giải thích chi tiết trong 90 ngày");
        pkg3 = packageRepository.save(pkg3);

        PricePackage pkgLife = new PricePackage();
        pkgLife.setSubject(subSWD);
        pkgLife.setPackageName("Gói Trọn Đời (12 Tháng)");
        pkgLife.setAccessDurationMonths(12);
        pkgLife.setListPrice(new BigDecimal("2500000"));
        pkgLife.setSalePrice(new BigDecimal("1790000"));
        pkgLife.setStatus("Active");
        pkgLife.setDescription("Truy cập trọn đời tất cả các kỳ thi thử cập nhật mới nhất, hỗ trợ 1-1 từ giảng viên");
        pkgLife = packageRepository.save(pkgLife);

        // Packages for PRJ301
        PricePackage pkgPRJ = new PricePackage();
        pkgPRJ.setSubject(subPRJ);
        pkgPRJ.setPackageName("Gói Truy Cập 3 Tháng");
        pkgPRJ.setAccessDurationMonths(3);
        pkgPRJ.setListPrice(new BigDecimal("990000"));
        pkgPRJ.setSalePrice(new BigDecimal("690000"));
        pkgPRJ.setStatus("Active");
        pkgPRJ.setDescription("Truy cập ngân hàng câu hỏi Java Web và Spring Boot");
        pkgPRJ = packageRepository.save(pkgPRJ);

        // 10. Lessons for SWD392
        Lesson lTopic1 = new Lesson();
        lTopic1.setSubject(subSWD);
        lTopic1.setPricePackage(pkg3);
        lTopic1.setLessonName("Chương 1: Tổng quan Kiến trúc phần mềm & Thuộc tính chất lượng");
        lTopic1.setLessonType(stTopic);
        lTopic1.setDisplayOrder(1);
        lTopic1.setStatus(true);
        lTopic1 = lessonRepository.save(lTopic1);

        Lesson l1 = new Lesson();
        l1.setSubject(subSWD);
        l1.setPricePackage(pkg3);
        l1.setLessonName("1.1 Phân biệt Software Architecture và Software Design");
        l1.setLessonType(stLesson);
        l1.setDisplayOrder(2);
        l1.setVideoLink("https://www.youtube.com/watch?v=DngazCObAEM");
        l1.setHtmlContent("<p>Kiến trúc phần mềm định hình cấu trúc cấp cao và các quyết định kỹ thuật khó thay đổi của hệ thống...</p>");
        l1.setStatus(true);
        l1 = lessonRepository.save(l1);

        Lesson l2 = new Lesson();
        l2.setSubject(subSWD);
        l2.setPricePackage(pkg3);
        l2.setLessonName("1.2 Clean Architecture và Các nguyên lý SOLID");
        l2.setLessonType(stLesson);
        l2.setDisplayOrder(3);
        l2.setVideoLink("https://www.youtube.com/watch?v=2dKZ-dWaCiU");
        l2.setHtmlContent("<p>Clean Architecture đặt business domain ở trung tâm và cô lập các thành phần ngoại vi thông qua Dependency Inversion...</p>");
        l2.setStatus(true);
        l2 = lessonRepository.save(l2);

        // 11. Quizzes
        Quiz quizSim1 = new Quiz();
        quizSim1.setSubject(subSWD);
        quizSim1.setQuizName("SWD392 Simulation Exam 01 - Full Test (2026)");
        quizSim1.setTestType("Simulation");
        quizSim1.setLevel("Medium");
        quizSim1.setDuration(45);
        quizSim1.setPassRate(new BigDecimal("70.00"));
        quizSim1.setTotalQuestions(10);
        quizSim1.setIsRandom(true);
        quizSim1.setStatus("Published");
        quizSim1.setDescription("Đề thi thử mô phỏng toàn diện môn SWD392 thời lượng 45 phút, bao gồm 10 câu hỏi trắc nghiệm có chấm điểm và bảng review tiến độ.");
        quizSim1.setCreatedBy(expertUser);
        quizSim1 = quizRepository.save(quizSim1);

        Quiz quizSim2 = new Quiz();
        quizSim2.setSubject(subSWD);
        quizSim2.setQuizName("SWD392 Simulation Exam 02 - Advanced Architecture Patterns");
        quizSim2.setTestType("Simulation");
        quizSim2.setLevel("Hard");
        quizSim2.setDuration(60);
        quizSim2.setPassRate(new BigDecimal("75.00"));
        quizSim2.setTotalQuestions(12);
        quizSim2.setIsRandom(true);
        quizSim2.setStatus("Published");
        quizSim2.setDescription("Đề thi chuyên sâu về Microservices, Event-Driven Architecture và Distributed Systems.");
        quizSim2.setCreatedBy(expertUser);
        quizSim2 = quizRepository.save(quizSim2);

        // Lesson Quiz
        Quiz quizLesson = new Quiz();
        quizLesson.setSubject(subSWD);
        quizLesson.setQuizName("Quiz Ôn Tập Chương 1 - Kiến Trúc & SOLID");
        quizLesson.setTestType("Lesson-Quiz");
        quizLesson.setLevel("Easy");
        quizLesson.setDuration(20);
        quizLesson.setPassRate(new BigDecimal("60.00"));
        quizLesson.setTotalQuestions(5);
        quizLesson.setIsRandom(false);
        quizLesson.setStatus("Published");
        quizLesson.setDescription("Bài kiểm tra nhanh kiến thức chương 1.");
        quizLesson.setCreatedBy(expertUser);
        quizLesson = quizRepository.save(quizLesson);

        Lesson lQuiz = new Lesson();
        lQuiz.setSubject(subSWD);
        lQuiz.setPricePackage(pkg3);
        lQuiz.setLessonName("1.3 Kiểm tra kiến thức Chương 1 (Lesson Quiz)");
        lQuiz.setLessonType(stQuiz);
        lQuiz.setDisplayOrder(4);
        lQuiz.setQuiz(quizLesson);
        lQuiz.setStatus(true);
        lessonRepository.save(lQuiz);

        // 12. Questions Bank (Realistic Multiple Choice Questions)
        List<Question> seededQuestions = new ArrayList<>();

        // Q1
        Question q1 = createQ(subSWD, l1, dimDomainArch, expertUser,
                "Trong mô hình Clean Architecture của Robert C. Martin (Uncle Bob), quy tắc phụ thuộc (Dependency Rule) quy định điều gì?",
                "Medium",
                "Quy tắc phụ thuộc trong Clean Architecture khẳng định mã nguồn chỉ được phụ thuộc hướng vào bên trong (Inward Dependencies). Các tầng bên ngoài (UI, DB) phụ thuộc vào tầng bên trong (Use Cases, Entities), nhưng tầng bên trong tuyệt đối không được biết gì về tầng bên ngoài.",
                "A. Các tầng bên trong phụ thuộc trực tiếp vào database để tăng tốc độ truy vấn.", false,
                "B. Mã nguồn chỉ được phụ thuộc hướng vào bên trong, tầng bên trong không biết gì về tầng bên ngoài.", true,
                "C. Các tầng bên ngoài và bên trong có thể gọi chéo lẫn nhau qua Singleton.", false,
                "D. UI có quyền gọi trực tiếp đến database mà không cần thông qua tầng nghiệp vụ.", false);
        seededQuestions.add(q1);

        // Q2
        Question q2 = createQ(subSWD, l2, dimDomainPatterns, expertUser,
                "Nguyên lý nào trong SOLID phát biểu rằng: 'Các thực thể phần mềm nên mở cho việc mở rộng (extension) nhưng đóng cho việc sửa đổi (modification)'?",
                "Easy",
                "Đây chính là định nghĩa của OCP (Open/Closed Principle). Hệ thống nên thiết kế để khi có yêu cầu mới, ta có thể bổ sung code mới mà không cần sửa đổi mã nguồn đã hoạt động ổn định.",
                "A. Single Responsibility Principle (SRP)", false,
                "B. Open/Closed Principle (OCP)", true,
                "C. Liskov Substitution Principle (LSP)", false,
                "D. Dependency Inversion Principle (DIP)", false);
        seededQuestions.add(q2);

        // Q3
        Question q3 = createQ(subSWD, l1, dimDomainArch, expertUser,
                "Trong kiến trúc Microservices, mẫu thiết kế Circuit Breaker được sử dụng với mục đích chính là gì?",
                "Medium",
                "Circuit Breaker theo dõi các lỗi khi gọi dịch vụ từ xa. Khi tỷ lệ lỗi vượt ngưỡng, nó tự ngắt mạch và trả về phản hồi fallback ngay lập tức nhằm ngăn chặn tình trạng sập dây chuyền (cascading failure).",
                "A. Tự động mã hóa tất cả dữ liệu lưu trữ trong cơ sở dữ liệu.", false,
                "B. Ngăn chặn lỗi lan truyền (cascading failure) khi một dịch vụ phụ thuộc gặp sự cố.", true,
                "C. Tăng dung lượng bộ nhớ RAM của container khi quá tải.", false,
                "D. Đồng bộ hóa dữ liệu thời gian thực giữa các dịch vụ mà không cần mạng.", false);
        seededQuestions.add(q3);

        // Q4
        Question q4 = createQ(subSWD, l2, dimGroupReq, expertUser,
                "Khi đo lường thuộc tính chất lượng (Quality Attribute) 'Modifiability' (Khả năng sửa đổi), yếu tố nào sau đây là quan trọng nhất?",
                "Medium",
                "Modifiability đo lường chi phí (thời gian, nỗ lực, nhân lực) để thực hiện một sự thay đổi mà không làm ảnh hưởng xấu đến các thành phần khác trong hệ thống.",
                "A. Thời gian phản hồi trung bình của API dưới 200ms.", false,
                "B. Tỷ lệ lỗi 500 khi có 10,000 người dùng đồng thời.", false,
                "C. Chi phí và mức độ ảnh hưởng (ripple effect) khi thay đổi một yêu cầu chức năng.", true,
                "D. Tần suất sao lưu dữ liệu tự động hằng ngày của hệ thống.", false);
        seededQuestions.add(q4);

        // Q5
        Question q5 = createQ(subSWD, l1, dimDomainArch, expertUser,
                "Mẫu thiết kế API Gateway trong hệ thống phân tán đóng vai trò gì?",
                "Easy",
                "API Gateway đóng vai trò là điểm vào duy nhất (Single Entry Point) cho client bên ngoài, đảm nhiệm routing, load balancing, xác thực (Auth), rate limiting và gom nhóm request.",
                "A. Lưu trữ toàn bộ dữ liệu bảng quan hệ của hệ thống.", false,
                "B. Điểm tiếp nhận yêu cầu duy nhất cho client, quản lý định tuyến, xác thực và rate limiting.", true,
                "C. Biên dịch mã nguồn Java sang mã máy trên máy chủ.", false,
                "D. Thay thế hoàn toàn cơ chế bảo mật JWT trên backend.", false);
        seededQuestions.add(q5);

        // Q6
        Question q6 = createQ(subSWD, l2, dimDomainPatterns, expertUser,
                "Khi bạn muốn đóng gói một tập hợp các đối tượng phức tạp và cung cấp một giao diện đơn giản, thống nhất cho client sử dụng, bạn nên dùng Design Pattern nào?",
                "Easy",
                "Facade Pattern cung cấp một interface đơn giản hóa cho một hệ thống con (subsystem) phức tạp, giúp che giấu sự phức tạp của các lớp bên dưới đối với client.",
                "A. Facade Pattern", true,
                "B. Observer Pattern", false,
                "C. Strategy Pattern", false,
                "D. Decorator Pattern", false);
        seededQuestions.add(q6);

        // Q7
        Question q7 = createQ(subSWD, l1, dimDomainArch, expertUser,
                "Trong định lý CAP dành cho hệ thống phân tán, ba yếu tố cấu thành bao gồm:",
                "Medium",
                "CAP theorem bao gồm: Consistency (Tính nhất quán), Availability (Tính sẵn sàng) và Partition Tolerance (Khả năng chịu lỗi phân vùng mạng). Một hệ thống phân tán chỉ có thể đảm bảo tối đa 2 trong 3 thuộc tính tại một thời điểm.",
                "A. Concurrency, Accuracy, Performance", false,
                "B. Consistency, Availability, Partition Tolerance", true,
                "C. Cohesion, Adaptability, Portability", false,
                "D. Confidentiality, Authenticity, Privacy", false);
        seededQuestions.add(q7);

        // Q8
        Question q8 = createQ(subSWD, l2, dimDomainPatterns, expertUser,
                "Strategy Pattern phù hợp nhất cho tình huống nào sau đây?",
                "Medium",
                "Strategy Pattern định nghĩa một họ các thuật toán, đóng gói từng thuật toán và cho phép chúng có thể hoán đổi cho nhau tại thời điểm thực thi (runtime) tùy theo điều kiện thực tế.",
                "A. Khi cần đảm bảo một lớp chỉ có duy nhất một đối tượng thể hiện trong toàn bộ ứng dụng.", false,
                "B. Khi có nhiều thuật toán hoán đổi được cho nhau (ví dụ: các thuật toán tính giá, giảm giá, thanh toán).", true,
                "C. Khi cần theo dõi và gửi thông báo khi trạng thái của một đối tượng thay đổi.", false,
                "D. Khi muốn tạo đối tượng mà không cần chỉ định cụ thể lớp cần khởi tạo.", false);
        seededQuestions.add(q8);

        // Q9
        Question q9 = createQ(subSWD, l1, dimGroupReq, expertUser,
                "Chiến thuật kiến trúc (Architectural Tactic) nào sau đây nhằm nâng cao thuộc tính 'Availability' (Tính sẵn sàng)?",
                "Hard",
                "Active Redundancy (Dự phòng chủ động - Hot Standby) cho phép các server dự phòng nhận request song song hoặc sẵn sàng thay thế ngay lập tức mà không có độ trễ khi server chính gặp sự cố.",
                "A. Tăng kích thước bộ nhớ đệm Cache trên trình duyệt.", false,
                "B. Active Redundancy (Dự phòng chủ động) với cơ chế tự động chuyển đổi dự phòng (failover).", true,
                "C. Mã hóa dữ liệu bằng thuật toán RSA-4096.", false,
                "D. Sử dụng Microkernel để giảm kích thước file jar.", false);
        seededQuestions.add(q9);

        // Q10
        Question q10 = createQ(subSWD, l2, dimDomainArch, expertUser,
                "Trong kiến trúc Event-Driven Architecture (EDA), thành phần Event Broker chịu trách nhiệm:",
                "Medium",
                "Event Broker (ví dụ: Apache Kafka, RabbitMQ) nhận sự kiện từ Event Producer, lưu trữ tạm thời và phân phối chúng đến các Event Consumer quan tâm một cách bất đồng bộ.",
                "A. Thực thi logic nghiệp vụ và tính toán kết quả trả về tức thời cho client.", false,
                "B. Nhận, lưu trữ tạm thời và chuyển tiếp các sự kiện từ Producer đến Consumer một cách bất đồng bộ.", true,
                "C. Xóa các sự kiện ngay khi nhận được mà không lưu vết.", false,
                "D. Kết nối trực tiếp cơ sở dữ liệu quan hệ của Producer sang Consumer.", false);
        seededQuestions.add(q10);

        // Map questions to quiz 1
        int orderIdx = 1;
        for (Question q : seededQuestions) {
            mappingRepository.save(new QuizQuestionMapping(quizSim1, q, orderIdx++));
        }

        // 13. Registrations & Payments
        // User registration for customerUser on SWD392 (Paid)
        UserRegistration regPaid = new UserRegistration();
        regPaid.setUser(customerUser);
        regPaid.setSubject(subSWD);
        regPaid.setPricePackage(pkg3);
        regPaid.setFullName(customerUser.getFullName());
        regPaid.setEmail(customerUser.getEmail());
        regPaid.setMobile(customerUser.getMobile());
        regPaid.setGender("Male");
        regPaid.setRegistrationTime(LocalDateTime.now().minusDays(5));
        regPaid.setTotalCost(pkg3.getSalePrice());
        regPaid.setStatus("Paid");
        regPaid.setValidFrom(LocalDate.now().minusDays(5));
        regPaid.setValidTo(LocalDate.now().plusMonths(3));
        regPaid.setNotes("Đã thanh toán qua chuyển khoản ngân hàng Techcombank.");
        regPaid.setUpdatedBy(saleUser);
        regPaid = registrationRepository.save(regPaid);

        Payment pay1 = new Payment();
        pay1.setRegistration(regPaid);
        pay1.setAmount(regPaid.getTotalCost());
        pay1.setMethod("Bank Transfer");
        pay1.setTransactionCode("FT260408129983");
        pay1.setStatus("Completed");
        pay1.setPaidAt(LocalDateTime.now().minusDays(5));
        pay1.setCreatedBy(saleUser);
        paymentRepository.save(pay1);

        // Submitted registration for customer on PRJ301 (Pending payment)
        UserRegistration regSubmitted = new UserRegistration();
        regSubmitted.setUser(customerUser);
        regSubmitted.setSubject(subPRJ);
        regSubmitted.setPricePackage(pkgPRJ);
        regSubmitted.setFullName(customerUser.getFullName());
        regSubmitted.setEmail(customerUser.getEmail());
        regSubmitted.setMobile(customerUser.getMobile());
        regSubmitted.setGender("Male");
        regSubmitted.setRegistrationTime(LocalDateTime.now().minusDays(1));
        regSubmitted.setTotalCost(pkgPRJ.getSalePrice());
        regSubmitted.setStatus("Submitted");
        regSubmitted.setNotes("Chờ học viên chuyển khoản xác nhận đơn hàng.");
        registrationRepository.save(regSubmitted);

        // 14. Practice Test and Completed Session with Result (So Practices List is populated!)
        PracticeTest pt = new PracticeTest();
        pt.setUser(customerUser);
        pt.setSubject(subSWD);
        pt.setTopic(l1);
        pt.setDimension(dimDomainArch);
        pt.setQuestionCount(5);
        pt.setStatus("Completed");
        pt.setQuestionLevel("Medium");
        pt.setCreatedAt(LocalDateTime.now().minusDays(2));
        pt = practiceRepository.save(pt);

        TestSession sess1 = new TestSession();
        sess1.setUser(customerUser);
        sess1.setTestType("Practice");
        sess1.setPractice(pt);
        sess1.setStartedAt(LocalDateTime.now().minusDays(2).minusMinutes(25));
        sess1.setSubmittedAt(LocalDateTime.now().minusDays(2));
        sess1.setStatus("Submitted");
        sess1.setCurrentQuestionNo(5);
        sess1.setDurationSeconds(1500); // 25 mins

        List<Question> subSample = seededQuestions.subList(0, 5);
        sess1.setQuestionOrderSnapshot(subSample.get(0).getQuestionId() + "," + subSample.get(1).getQuestionId() + "," + subSample.get(2).getQuestionId() + "," + subSample.get(3).getQuestionId() + "," + subSample.get(4).getQuestionId());
        sess1 = sessionRepository.save(sess1);

        int cCount = 0;
        for (int i = 0; i < subSample.size(); i++) {
            Question q = subSample.get(i);
            UserAnswer ua = new UserAnswer();
            ua.setSession(sess1);
            ua.setQuestion(q);
            // Choose correct answer for first 4, wrong for 5th
            QuestionOption selOpt = null;
            if (i < 4) {
                selOpt = q.getOptions().stream().filter(o -> Boolean.TRUE.equals(o.getIsCorrect())).findFirst().orElse(null);
                cCount++;
            } else {
                selOpt = q.getOptions().stream().filter(o -> !Boolean.TRUE.equals(o.getIsCorrect())).findFirst().orElse(null);
            }
            ua.setSelectedOption(selOpt);
            ua.setIsMarked(i == 2);
            ua.setAnsweredAt(sess1.getStartedAt().plusMinutes(i * 4));
            userAnswerRepository.save(ua);
        }

        ExamResult res1 = new ExamResult();
        res1.setSession(sess1);
        res1.setUser(customerUser);
        res1.setTotalQuestions(5);
        res1.setAnsweredCount(5);
        res1.setCorrectCount(cCount);
        res1.setIncorrectCount(1);
        res1.setUnansweredCount(0);
        res1.setScore(new BigDecimal("80.00"));
        res1.setIsPassed(true);
        res1.setSubmittedAt(sess1.getSubmittedAt());
        examResultRepository.save(res1);

        System.out.println(">>> Quiz Practice System Seed Data Initialized Successfully!");
    }

    private Question createQ(Subject subject, Lesson lesson, SubjectDimension dimension, User author,
                             String content, String level, String explanation,
                             String optA, boolean isA,
                             String optB, boolean isB,
                             String optC, boolean isC,
                             String optD, boolean isD) {
        Question q = new Question();
        q.setSubject(subject);
        q.setLesson(lesson);
        q.setDimension(dimension);
        q.setContent(content);
        q.setLevel(level);
        q.setStatus("Published");
        q.setExplanation(explanation);
        q.setCreatedBy(author);
        q.setCreatedAt(LocalDateTime.now());
        q = questionRepository.save(q);

        QuestionOption oA = new QuestionOption(q, optA, isA, 1);
        QuestionOption oB = new QuestionOption(q, optB, isB, 2);
        QuestionOption oC = new QuestionOption(q, optC, isC, 3);
        QuestionOption oD = new QuestionOption(q, optD, isD, 4);
        optionRepository.saveAll(Arrays.asList(oA, oB, oC, oD));

        return q;
    }
}

