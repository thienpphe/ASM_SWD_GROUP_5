package com.quizpractice.service;

import com.quizpractice.dto.ContentDTOs.*;
import com.quizpractice.entity.*;
import com.quizpractice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<User> searchUsers(String roleName, String status, String gender, String search, Pageable pageable) {
        return userRepository.searchUsers(roleName, status, gender, search, pageable);
    }

    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User createUser(UserManageRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setGender(request.getGender() != null ? request.getGender() : "Male");
        user.setAddress(request.getAddress());
        user.setAvatarUrl(request.getAvatarUrl() != null ? request.getAvatarUrl() : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
        user.setRole(role);
        user.setStatus(request.getStatus() != null ? request.getStatus() : "Active");

        String pwd = request.getPassword() != null && !request.getPassword().isEmpty() ? request.getPassword() : "123456";
        user.setPasswordHash(passwordEncoder.encode(pwd));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long userId, UserManageRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId()).orElse(null);
            if (role != null) user.setRole(role);
        }
        if (request.getStatus() != null) user.setStatus(request.getStatus());
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getMobile() != null) user.setMobile(request.getMobile());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}

