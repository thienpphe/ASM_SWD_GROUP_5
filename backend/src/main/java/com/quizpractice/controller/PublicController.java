package com.quizpractice.controller;

import com.quizpractice.dto.CommonDTOs.ApiResponse;
import com.quizpractice.dto.ContentDTOs.RegistrationRequest;
import com.quizpractice.entity.*;
import com.quizpractice.repository.BlogCategoryRepository;
import com.quizpractice.repository.SubjectCategoryRepository;
import com.quizpractice.repository.UserRepository;
import com.quizpractice.security.UserPrincipal;
import com.quizpractice.service.BlogService;
import com.quizpractice.service.RegistrationService;
import com.quizpractice.service.SliderService;
import com.quizpractice.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private SliderService sliderService;

    @Autowired
    private BlogService blogService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private SubjectCategoryRepository subjectCategoryRepository;

    @Autowired
    private BlogCategoryRepository blogCategoryRepository;

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/home")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHomeData() {
        Map<String, Object> data = new HashMap<>();
        data.put("sliders", sliderService.getActiveSliders());
        data.put("featuredBlogs", blogService.getFeaturedBlogs());
        data.put("latestBlogs", blogService.getLatestBlogs());
        data.put("featuredSubjects", subjectService.getFeaturedSubjects());
        data.put("subjectCategories", subjectCategoryRepository.findAll());
        data.put("blogCategories", blogCategoryRepository.findAll());
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/sliders")
    public ResponseEntity<ApiResponse<List<Slider>>> getSliders() {
        return ResponseEntity.ok(ApiResponse.ok(sliderService.getActiveSliders()));
    }

    @GetMapping("/blogs")
    public ResponseEntity<ApiResponse<Page<Blog>>> getBlogs(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        Page<Blog> blogs = blogService.searchPublicBlogs(categoryId, search, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.ok(blogs));
    }

    @GetMapping("/blogs/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBlogDetails(@PathVariable Long id) {
        try {
            Blog blog = blogService.getBlogDetails(id);
            Map<String, Object> map = new HashMap<>();
            map.put("blog", blog);
            map.put("latestBlogs", blogService.getLatestBlogs());
            map.put("categories", blogCategoryRepository.findAll());
            return ResponseEntity.ok(ApiResponse.ok(map));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<Page<Subject>>> getSubjects(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        Page<Subject> subjects = subjectService.searchPublicSubjects(search, categoryId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.ok(subjects));
    }

    @GetMapping("/subjects/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSubjectDetails(@PathVariable Long id) {
        try {
            Map<String, Object> details = subjectService.getSubjectDetails(id);
            details.put("categories", subjectCategoryRepository.findAll());
            details.put("featuredSubjects", subjectService.getFeaturedSubjects());
            return ResponseEntity.ok(ApiResponse.ok(details));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register-subject")
    public ResponseEntity<ApiResponse<UserRegistration>> registerSubject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody RegistrationRequest request) {
        try {
            User user = null;
            if (userPrincipal != null) {
                user = userRepository.findById(userPrincipal.getId()).orElse(null);
            }
            UserRegistration reg = registrationService.registerSubject(request, user);
            return ResponseEntity.ok(ApiResponse.ok("Registration submitted successfully. Our sales team will verify your payment.", reg));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

