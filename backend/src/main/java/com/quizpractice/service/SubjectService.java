package com.quizpractice.service;

import com.quizpractice.dto.ContentDTOs.*;
import com.quizpractice.entity.*;
import com.quizpractice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SubjectCategoryRepository categoryRepository;

    @Autowired
    private SubjectDimensionRepository dimensionRepository;

    @Autowired
    private PricePackageRepository packageRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizRepository quizRepository;

    public Page<Subject> searchPublicSubjects(String search, Long categoryId, Pageable pageable) {
        return subjectRepository.searchSubjects("Published", categoryId, search, pageable);
    }

    public List<Subject> getFeaturedSubjects() {
        return subjectRepository.findByIsFeaturedTrueAndStatus("Published");
    }

    public Map<String, Object> getSubjectDetails(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + subjectId));

        List<PricePackage> packages = packageRepository.findBySubject_SubjectIdAndStatus(subjectId, "Active");
        List<SubjectDimension> dimensions = dimensionRepository.findBySubject_SubjectId(subjectId);
        List<Lesson> lessons = lessonRepository.findBySubject_SubjectIdOrderByDisplayOrderAsc(subjectId);

        PricePackage lowestPrice = packageRepository.findTopBySubject_SubjectIdAndStatusOrderBySalePriceAsc(subjectId, "Active").orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("subject", subject);
        response.put("packages", packages);
        response.put("dimensions", dimensions);
        response.put("lessons", lessons);
        response.put("lowestPrice", lowestPrice);
        return response;
    }

    public List<Subject> getSubjectsForUser(User user) {
        if ("ADMIN".equalsIgnoreCase(user.getRole().getRoleName())) {
            return subjectRepository.findAll();
        } else if ("EXPERT".equalsIgnoreCase(user.getRole().getRoleName())) {
            return subjectRepository.findByOwner_UserId(user.getUserId());
        } else {
            return subjectRepository.findByStatus("Published");
        }
    }

    @Transactional
    public Subject createSubject(SubjectRequest request, User currentUser) {
        SubjectCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        User owner = currentUser;
        if (request.getOwnerId() != null && "ADMIN".equalsIgnoreCase(currentUser.getRole().getRoleName())) {
            owner = userRepository.findById(request.getOwnerId()).orElse(currentUser);
        }

        Subject subject = new Subject();
        subject.setSubjectName(request.getSubjectName());
        subject.setCategory(category);
        subject.setOwner(owner);
        subject.setTagLine(request.getTagLine());
        subject.setBriefInfo(request.getBriefInfo());
        subject.setDescription(request.getDescription());
        subject.setThumbnailUrl(request.getThumbnailUrl());
        subject.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        subject.setStatus(request.getStatus() != null ? request.getStatus() : "Published");
        subject.setCreatedAt(LocalDateTime.now());
        subject.setUpdatedAt(LocalDateTime.now());
        subject.setUpdatedBy(currentUser);

        return subjectRepository.save(subject);
    }

    @Transactional
    public Subject updateSubject(Long subjectId, SubjectRequest request, User currentUser) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (request.getCategoryId() != null) {
            SubjectCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            subject.setCategory(category);
        }

        if (request.getOwnerId() != null && "ADMIN".equalsIgnoreCase(currentUser.getRole().getRoleName())) {
            User owner = userRepository.findById(request.getOwnerId()).orElse(subject.getOwner());
            subject.setOwner(owner);
        }

        if (request.getSubjectName() != null) subject.setSubjectName(request.getSubjectName());
        if (request.getTagLine() != null) subject.setTagLine(request.getTagLine());
        if (request.getBriefInfo() != null) subject.setBriefInfo(request.getBriefInfo());
        if (request.getDescription() != null) subject.setDescription(request.getDescription());
        if (request.getThumbnailUrl() != null) subject.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getIsFeatured() != null) subject.setIsFeatured(request.getIsFeatured());
        if (request.getStatus() != null && "ADMIN".equalsIgnoreCase(currentUser.getRole().getRoleName())) {
            subject.setStatus(request.getStatus());
        }

        subject.setUpdatedAt(LocalDateTime.now());
        subject.setUpdatedBy(currentUser);

        return subjectRepository.save(subject);
    }

    // Dimensions
    public List<SubjectDimension> getDimensions(Long subjectId) {
        return dimensionRepository.findBySubject_SubjectId(subjectId);
    }

    @Transactional
    public SubjectDimension createDimension(DimensionRequest request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        SystemSetting type = systemSettingRepository.findById(request.getDimensionTypeId())
                .orElseThrow(() -> new RuntimeException("Dimension type setting not found"));

        SubjectDimension dim = new SubjectDimension();
        dim.setSubject(subject);
        dim.setDimensionType(type);
        dim.setDimensionName(request.getDimensionName());
        dim.setDescription(request.getDescription());
        return dimensionRepository.save(dim);
    }

    @Transactional
    public void deleteDimension(Long dimensionId) {
        dimensionRepository.deleteById(dimensionId);
    }

    // Packages
    public List<PricePackage> getPackages(Long subjectId) {
        return packageRepository.findBySubject_SubjectId(subjectId);
    }

    @Transactional
    public PricePackage createPackage(PricePackageRequest request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        PricePackage pkg = new PricePackage();
        pkg.setSubject(subject);
        pkg.setPackageName(request.getPackageName());
        pkg.setAccessDurationMonths(request.getAccessDurationMonths());
        pkg.setListPrice(request.getListPrice());
        pkg.setSalePrice(request.getSalePrice() != null ? request.getSalePrice() : request.getListPrice());
        pkg.setStatus(request.getStatus() != null ? request.getStatus() : "Active");
        pkg.setDescription(request.getDescription());
        pkg.setCreatedAt(LocalDateTime.now());
        pkg.setUpdatedAt(LocalDateTime.now());
        return packageRepository.save(pkg);
    }

    @Transactional
    public PricePackage updatePackage(Long packageId, PricePackageRequest request) {
        PricePackage pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Price package not found"));

        if (request.getPackageName() != null) pkg.setPackageName(request.getPackageName());
        if (request.getAccessDurationMonths() != null) pkg.setAccessDurationMonths(request.getAccessDurationMonths());
        if (request.getListPrice() != null) pkg.setListPrice(request.getListPrice());
        if (request.getSalePrice() != null) pkg.setSalePrice(request.getSalePrice());
        if (request.getStatus() != null) pkg.setStatus(request.getStatus());
        if (request.getDescription() != null) pkg.setDescription(request.getDescription());
        pkg.setUpdatedAt(LocalDateTime.now());

        return packageRepository.save(pkg);
    }

    // Lessons
    public List<Lesson> getLessons(Long subjectId, Long packageId) {
        if (packageId != null) {
            return lessonRepository.findBySubject_SubjectIdAndPricePackage_PackageIdOrderByDisplayOrderAsc(subjectId, packageId);
        }
        return lessonRepository.findBySubject_SubjectIdOrderByDisplayOrderAsc(subjectId);
    }

    @Transactional
    public Lesson createLesson(LessonRequest request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        SystemSetting lessonType = systemSettingRepository.findById(request.getLessonTypeId())
                .orElseThrow(() -> new RuntimeException("Lesson type setting not found"));

        Lesson lesson = new Lesson();
        lesson.setSubject(subject);
        if (request.getPackageId() != null) {
            PricePackage pkg = packageRepository.findById(request.getPackageId()).orElse(null);
            lesson.setPricePackage(pkg);
        }
        lesson.setLessonName(request.getLessonName());
        lesson.setLessonType(lessonType);
        lesson.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        lesson.setVideoLink(request.getVideoLink());
        lesson.setHtmlContent(request.getHtmlContent());
        if (request.getQuizId() != null) {
            Quiz quiz = quizRepository.findById(request.getQuizId()).orElse(null);
            lesson.setQuiz(quiz);
        }
        lesson.setStatus(request.getStatus() != null ? request.getStatus() : true);
        lesson.setCreatedAt(LocalDateTime.now());
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson updateLesson(Long lessonId, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (request.getLessonName() != null) lesson.setLessonName(request.getLessonName());
        if (request.getDisplayOrder() != null) lesson.setDisplayOrder(request.getDisplayOrder());
        if (request.getVideoLink() != null) lesson.setVideoLink(request.getVideoLink());
        if (request.getHtmlContent() != null) lesson.setHtmlContent(request.getHtmlContent());
        if (request.getStatus() != null) lesson.setStatus(request.getStatus());
        if (request.getLessonTypeId() != null) {
            SystemSetting lessonType = systemSettingRepository.findById(request.getLessonTypeId()).orElse(lesson.getLessonType());
            lesson.setLessonType(lessonType);
        }
        if (request.getPackageId() != null) {
            PricePackage pkg = packageRepository.findById(request.getPackageId()).orElse(null);
            lesson.setPricePackage(pkg);
        }
        if (request.getQuizId() != null) {
            Quiz quiz = quizRepository.findById(request.getQuizId()).orElse(null);
            lesson.setQuiz(quiz);
        }
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson toggleLessonStatus(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        lesson.setStatus(!lesson.getStatus());
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }
}

