package com.quizpractice.controller;

import com.quizpractice.dto.CommonDTOs.ApiResponse;
import com.quizpractice.dto.ContentDTOs.QuestionRequest;
import com.quizpractice.dto.ContentDTOs.QuizRequest;
import com.quizpractice.entity.Question;
import com.quizpractice.entity.Quiz;
import com.quizpractice.entity.User;
import com.quizpractice.repository.UserRepository;
import com.quizpractice.security.UserPrincipal;
import com.quizpractice.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/testing")
public class TestingContentController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private UserRepository userRepository;

    // Questions Bank
    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<Page<Question>>> getQuestions(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long lessonId,
            @RequestParam(required = false) Long dimensionId,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Question> questions = questionService.searchQuestions(subjectId, lessonId, dimensionId, level, status, search,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.ok(questions));
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<ApiResponse<Question>> getQuestion(@PathVariable Long id) {
        try {
            Question q = questionService.getQuestion(id);
            return ResponseEntity.ok(ApiResponse.ok(q));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/questions")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Question>> createQuestion(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody QuestionRequest request) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            Question q = questionService.createQuestion(request, user);
            return ResponseEntity.ok(ApiResponse.ok("Question created", q));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/questions/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Question>> updateQuestion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody QuestionRequest request) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            Question q = questionService.updateQuestion(id, request, user);
            return ResponseEntity.ok(ApiResponse.ok("Question updated", q));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/questions/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<String>> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok(ApiResponse.ok("Question deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/questions/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Question>> toggleQuestionStatus(@PathVariable Long id) {
        try {
            Question q = questionService.toggleQuestionStatus(id);
            return ResponseEntity.ok(ApiResponse.ok("Question status updated", q));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Question Import
    @PostMapping("/questions/import")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Integer>> importQuestions(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam Long subjectId,
            @RequestBody Map<String, String> body) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            String rawContent = body.get("content");
            int imported = questionService.importQuestions(subjectId, rawContent, user);
            return ResponseEntity.ok(ApiResponse.ok("Imported " + imported + " questions successfully", imported));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Quizzes List & Details
    @GetMapping("/quizzes")
    public ResponseEntity<ApiResponse<Page<Quiz>>> getQuizzes(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String testType,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Quiz> quizzes = questionService.searchQuizzes(subjectId, testType, search,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.ok(quizzes));
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQuizDetails(@PathVariable Long id) {
        try {
            Map<String, Object> map = questionService.getQuizDetails(id);
            return ResponseEntity.ok(ApiResponse.ok(map));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/quizzes")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Quiz>> createQuiz(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody QuizRequest request) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            Quiz quiz = questionService.createQuiz(request, user);
            return ResponseEntity.ok(ApiResponse.ok("Quiz created successfully", quiz));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/quizzes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<Quiz>> updateQuiz(
            @PathVariable Long id,
            @RequestBody QuizRequest request) {
        try {
            Quiz quiz = questionService.updateQuiz(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Quiz updated successfully", quiz));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/quizzes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<ApiResponse<String>> deleteQuiz(@PathVariable Long id) {
        try {
            questionService.deleteQuiz(id);
            return ResponseEntity.ok(ApiResponse.ok("Quiz deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

