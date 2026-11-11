package com.quizpractice.controller;

import com.quizpractice.dto.CommonDTOs.ApiResponse;
import com.quizpractice.dto.ContentDTOs.SettingRequest;
import com.quizpractice.dto.ContentDTOs.UserManageRequest;
import com.quizpractice.entity.Role;
import com.quizpractice.entity.SystemSetting;
import com.quizpractice.entity.User;
import com.quizpractice.service.AdminUserService;
import com.quizpractice.service.SettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private SettingService settingService;

    // Users List & Details
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<User>>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "userId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<User> users = adminUserService.searchUsers(role, status, gender, search, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(adminUserService.getUser(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody UserManageRequest request) {
        try {
            User user = adminUserService.createUser(request);
            return ResponseEntity.ok(ApiResponse.ok("User created successfully. Temporary password: " + (request.getPassword() != null ? request.getPassword() : "123456"), user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable Long id, @RequestBody UserManageRequest request) {
        try {
            User user = adminUserService.updateUser(id, request);
            return ResponseEntity.ok(ApiResponse.ok("User updated successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/roles")
    public ResponseEntity<ApiResponse<List<Role>>> getRoles() {
        return ResponseEntity.ok(ApiResponse.ok(adminUserService.getAllRoles()));
    }

    // System Settings
    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<List<SystemSetting>>> getSettings(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok(settingService.getSettings(type, status, search)));
    }

    @GetMapping("/settings/{id}")
    public ResponseEntity<ApiResponse<SystemSetting>> getSetting(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(settingService.getSetting(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/settings")
    public ResponseEntity<ApiResponse<SystemSetting>> createSetting(@RequestBody SettingRequest request) {
        try {
            SystemSetting s = settingService.createSetting(request);
            return ResponseEntity.ok(ApiResponse.ok("Setting created successfully", s));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/settings/{id}")
    public ResponseEntity<ApiResponse<SystemSetting>> updateSetting(@PathVariable Long id, @RequestBody SettingRequest request) {
        try {
            SystemSetting s = settingService.updateSetting(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Setting updated successfully", s));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/settings/{id}/status")
    public ResponseEntity<ApiResponse<SystemSetting>> toggleSettingStatus(@PathVariable Long id) {
        try {
            SystemSetting s = settingService.toggleSettingStatus(id);
            return ResponseEntity.ok(ApiResponse.ok("Setting status toggled", s));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

