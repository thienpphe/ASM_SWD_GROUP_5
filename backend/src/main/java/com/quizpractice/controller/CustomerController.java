package com.quizpractice.controller;

import com.quizpractice.dto.CommonDTOs.ApiResponse;
import com.quizpractice.dto.QuizDTOs.*;
import com.quizpractice.entity.Subject;
import com.quizpractice.entity.User;
import com.quizpractice.entity.UserRegistration;
import com.quizpractice.repository.UserRepository;
import com.quizpractice.security.UserPrincipal;
import com.quizpractice.service.QuizPracticeService;
import com.quizpractice.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private QuizPracticeService quizPracticeService;

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserRepository userRepository;

    // My Registrations
    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<List<UserRegistration>>> getMyRegistrations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        List<UserRegistration> regs = registrationService.getUserRegistrations(user);
        return ResponseEntity.ok(ApiResponse.ok(regs));
    }

    @PostMapping("/registrations/{id}/cancel")
    public ResponseEntity<ApiResponse<UserRegistration>> cancelRegistration(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            UserRegistration reg = registrationService.cancelRegistration(id, user);
            return ResponseEntity.ok(ApiResponse.ok("Registration cancelled successfully", reg));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Practices List
    @GetMapping("/practices")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPracticesList(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        List<Map<String, Object>> practices = quizPracticeService.listUserPractices(user);
        return ResponseEntity.ok(ApiResponse.ok(practices));
    }

    @GetMapping("/practices/subjects")
    public ResponseEntity<ApiResponse<List<Subject>>> getAccessibleSubjects(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        List<Subject> subjects = quizPracticeService.getAccessibleSubjects(user);
        return ResponseEntity.ok(ApiResponse.ok(subjects));
    }

    // Create New Practice Test
    @PostMapping("/practices/create")
    public ResponseEntity<ApiResponse<SessionStartResponse>> createPractice(
            @RequestBody PracticeCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            SessionStartResponse resp = quizPracticeService.createPracticeSession(request, user);
            return ResponseEntity.ok(ApiResponse.ok("Practice session created successfully", resp));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Simulation Exams
    @GetMapping("/simulation-exams")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSimulationExams(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String search) {
        List<Map<String, Object>> list = quizPracticeService.listSimulationExams(subjectId, search);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/simulation-exams/{quizId}/start")
    public ResponseEntity<ApiResponse<SessionStartResponse>> startSimulationExam(
            @PathVariable Long quizId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            SessionStartResponse resp = quizPracticeService.startSimulationExam(quizId, user);
            return ResponseEntity.ok(ApiResponse.ok("Simulation exam started", resp));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Quiz Handle: get Question
    @GetMapping("/session/{sessionId}/question/{questionNo}")
    public ResponseEntity<ApiResponse<QuestionViewDTO>> getSessionQuestion(
            @PathVariable Long sessionId,
            @PathVariable Integer questionNo,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            QuestionViewDTO q = quizPracticeService.getSessionQuestion(sessionId, questionNo, user);
            return ResponseEntity.ok(ApiResponse.ok(q));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Quiz Handle: save Answer
    @PostMapping("/session/{sessionId}/answer")
    public ResponseEntity<ApiResponse<String>> submitAnswer(
            @PathVariable Long sessionId,
            @RequestBody AnswerSubmitRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            quizPracticeService.submitAnswer(sessionId, request, user);
            return ResponseEntity.ok(ApiResponse.ok("Answer recorded", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Quiz Handle: Review Progress popup
    @GetMapping("/session/{sessionId}/progress")
    public ResponseEntity<ApiResponse<ExamProgressDTO>> getExamProgress(@PathVariable Long sessionId) {
        try {
            ExamProgressDTO dto = quizPracticeService.getExamProgress(sessionId);
            return ResponseEntity.ok(ApiResponse.ok(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Quiz Handle: Score Exam
    @PostMapping("/session/{sessionId}/score")
    public ResponseEntity<ApiResponse<ExamResultDTO>> scoreExam(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            ExamResultDTO result = quizPracticeService.scoreExam(sessionId, user);
            return ResponseEntity.ok(ApiResponse.ok("Exam scored successfully", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Quiz Review
    @GetMapping("/session/{sessionId}/review")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQuizReview(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            Map<String, Object> review = quizPracticeService.getQuizReview(sessionId, user);
            return ResponseEntity.ok(ApiResponse.ok(review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

