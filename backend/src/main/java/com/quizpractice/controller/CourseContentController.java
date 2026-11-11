package com.quizpractice.controller;

import com.quizpractice.dto.CommonDTOs.ApiResponse;
import com.quizpractice.dto.ContentDTOs.*;
import com.quizpractice.entity.*;
import com.quizpractice.repository.SubjectCategoryRepository;
import com.quizpractice.repository.UserRepository;
import com.quizpractice.security.UserPrincipal;
import com.quizpractice.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseContentController {

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectCategoryRepository categoryRepository;

    // Subjects List for Admin & Expert
    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<List<Subject>>> getSubjects(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        List<Subject> subjects = subjectService.getSubjectsForUser(user);
        return ResponseEntity.ok(ApiResponse.ok(subjects));
    }

    @PostMapping("/subjects")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Subject>> createSubject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody SubjectRequest request) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            Subject subject = subjectService.createSubject(request, user);
            return ResponseEntity.ok(ApiResponse.ok("Subject created successfully", subject));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/subjects/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Subject>> updateSubject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody SubjectRequest request) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            Subject subject = subjectService.updateSubject(id, request, user);
            return ResponseEntity.ok(ApiResponse.ok("Subject updated successfully", subject));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/subjects/{id}/details")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSubjectManageDetails(@PathVariable Long id) {
        try {
            Map<String, Object> details = subjectService.getSubjectDetails(id);
            details.put("allCategories", categoryRepository.findAll());
            return ResponseEntity.ok(ApiResponse.ok(details));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Dimensions
    @GetMapping("/subjects/{id}/dimensions")
    public ResponseEntity<ApiResponse<List<SubjectDimension>>> getDimensions(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(subjectService.getDimensions(id)));
    }

    @PostMapping("/dimensions")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<SubjectDimension>> createDimension(@RequestBody DimensionRequest request) {
        try {
            SubjectDimension dim = subjectService.createDimension(request);
            return ResponseEntity.ok(ApiResponse.ok("Dimension created", dim));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/dimensions/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<String>> deleteDimension(@PathVariable Long id) {
        try {
            subjectService.deleteDimension(id);
            return ResponseEntity.ok(ApiResponse.ok("Dimension deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Price Packages
    @GetMapping("/subjects/{id}/packages")
    public ResponseEntity<ApiResponse<List<PricePackage>>> getPackages(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(subjectService.getPackages(id)));
    }

    @PostMapping("/packages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PricePackage>> createPackage(@RequestBody PricePackageRequest request) {
        try {
            PricePackage pkg = subjectService.createPackage(request);
            return ResponseEntity.ok(ApiResponse.ok("Price package created", pkg));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/packages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PricePackage>> updatePackage(@PathVariable Long id, @RequestBody PricePackageRequest request) {
        try {
            PricePackage pkg = subjectService.updatePackage(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Price package updated", pkg));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Lessons
    @GetMapping("/subjects/{id}/lessons")
    public ResponseEntity<ApiResponse<List<Lesson>>> getLessons(
            @PathVariable Long id,
            @RequestParam(required = false) Long packageId) {
        return ResponseEntity.ok(ApiResponse.ok(subjectService.getLessons(id, packageId)));
    }

    @PostMapping("/lessons")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Lesson>> createLesson(@RequestBody LessonRequest request) {
        try {
            Lesson lesson = subjectService.createLesson(request);
            return ResponseEntity.ok(ApiResponse.ok("Lesson created", lesson));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/lessons/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Lesson>> updateLesson(@PathVariable Long id, @RequestBody LessonRequest request) {
        try {
            Lesson lesson = subjectService.updateLesson(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Lesson updated", lesson));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/lessons/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Lesson>> toggleLessonStatus(@PathVariable Long id) {
        try {
            Lesson lesson = subjectService.toggleLessonStatus(id);
            return ResponseEntity.ok(ApiResponse.ok("Lesson status updated", lesson));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

