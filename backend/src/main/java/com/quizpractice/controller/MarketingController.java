package com.quizpractice.controller;

import com.quizpractice.dto.CommonDTOs.ApiResponse;
import com.quizpractice.dto.ContentDTOs.BlogRequest;
import com.quizpractice.dto.ContentDTOs.DashboardStatsDTO;
import com.quizpractice.dto.ContentDTOs.SliderRequest;
import com.quizpractice.entity.Blog;
import com.quizpractice.entity.Slider;
import com.quizpractice.entity.User;
import com.quizpractice.repository.UserRepository;
import com.quizpractice.security.UserPrincipal;
import com.quizpractice.service.BlogService;
import com.quizpractice.service.DashboardService;
import com.quizpractice.service.SliderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marketing")
@PreAuthorize("hasAnyRole('MARKETING', 'ADMIN', 'SALE')")
public class MarketingController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private BlogService blogService;

    @Autowired
    private SliderService sliderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getStats()));
    }

    // Blogs management
    @GetMapping("/blogs")
    public ResponseEntity<ApiResponse<Page<Blog>>> getBlogs(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Blog> blogs = blogService.searchAllBlogs(categoryId, status, search, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.ok(blogs));
    }

    @PostMapping("/blogs")
    public ResponseEntity<ApiResponse<Blog>> createBlog(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody BlogRequest request) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            Blog blog = blogService.createBlog(request, user);
            return ResponseEntity.ok(ApiResponse.ok("Blog created successfully", blog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/blogs/{id}")
    public ResponseEntity<ApiResponse<Blog>> updateBlog(@PathVariable Long id, @RequestBody BlogRequest request) {
        try {
            Blog blog = blogService.updateBlog(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Blog updated successfully", blog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/blogs/{id}/status")
    public ResponseEntity<ApiResponse<Blog>> toggleBlogStatus(@PathVariable Long id) {
        try {
            Blog blog = blogService.toggleBlogStatus(id);
            return ResponseEntity.ok(ApiResponse.ok("Blog status updated", blog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Sliders management
    @GetMapping("/sliders")
    public ResponseEntity<ApiResponse<List<Slider>>> getSliders() {
        return ResponseEntity.ok(ApiResponse.ok(sliderService.getAllSliders()));
    }

    @GetMapping("/sliders/{id}")
    public ResponseEntity<ApiResponse<Slider>> getSlider(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(sliderService.getSlider(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/sliders")
    public ResponseEntity<ApiResponse<Slider>> createSlider(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody SliderRequest request) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            Slider slider = sliderService.createSlider(request, user);
            return ResponseEntity.ok(ApiResponse.ok("Slider created successfully", slider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/sliders/{id}")
    public ResponseEntity<ApiResponse<Slider>> updateSlider(@PathVariable Long id, @RequestBody SliderRequest request) {
        try {
            Slider slider = sliderService.updateSlider(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Slider updated successfully", slider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/sliders/{id}/status")
    public ResponseEntity<ApiResponse<Slider>> toggleSliderStatus(@PathVariable Long id) {
        try {
            Slider slider = sliderService.toggleSliderStatus(id);
            return ResponseEntity.ok(ApiResponse.ok("Slider status updated", slider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

