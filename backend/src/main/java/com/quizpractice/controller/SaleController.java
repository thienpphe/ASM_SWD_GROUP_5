package com.quizpractice.controller;

import com.quizpractice.dto.CommonDTOs.ApiResponse;
import com.quizpractice.dto.ContentDTOs.RegistrationUpdateRequest;
import com.quizpractice.entity.User;
import com.quizpractice.entity.UserRegistration;
import com.quizpractice.repository.UserRepository;
import com.quizpractice.security.UserPrincipal;
import com.quizpractice.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/sales")
@PreAuthorize("hasAnyRole('SALE', 'ADMIN')")
public class SaleController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<Page<UserRegistration>>> getRegistrations(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "registrationTime") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<UserRegistration> regs = registrationService.searchRegistrations(subjectId, status, fromDate, toDate, search, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.ok(regs));
    }

    @GetMapping("/registrations/{id}")
    public ResponseEntity<ApiResponse<UserRegistration>> getRegistrationDetails(@PathVariable Long id) {
        try {
            UserRegistration reg = registrationService.getRegistrationDetails(id);
            return ResponseEntity.ok(ApiResponse.ok(reg));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/registrations/{id}")
    public ResponseEntity<ApiResponse<UserRegistration>> updateRegistration(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody RegistrationUpdateRequest request) {
        try {
            User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
            UserRegistration reg = registrationService.updateRegistration(id, request, user);
            return ResponseEntity.ok(ApiResponse.ok("Registration updated successfully", reg));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

