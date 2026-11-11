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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RegistrationService {

    @Autowired
    private UserRegistrationRepository registrationRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private PricePackageRepository packageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public UserRegistration registerSubject(RegistrationRequest request, User currentUser) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        PricePackage pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Price package not found"));

        UserRegistration reg = new UserRegistration();
        reg.setSubject(subject);
        reg.setPricePackage(pkg);
        reg.setTotalCost(pkg.getSalePrice() != null ? pkg.getSalePrice() : pkg.getListPrice());
        reg.setStatus("Submitted");
        reg.setRegistrationTime(LocalDateTime.now());
        reg.setNotes(request.getNotes());

        if (currentUser != null) {
            reg.setUser(currentUser);
            reg.setFullName(currentUser.getFullName());
            reg.setEmail(currentUser.getEmail());
            reg.setMobile(currentUser.getMobile());
            reg.setGender(currentUser.getGender());
        } else {
            reg.setFullName(request.getFullName());
            reg.setEmail(request.getEmail());
            reg.setMobile(request.getMobile());
            reg.setGender(request.getGender() != null ? request.getGender() : "Male");

            userRepository.findByEmail(request.getEmail()).ifPresent(reg::setUser);
        }

        return registrationRepository.save(reg);
    }

    public List<UserRegistration> getUserRegistrations(User user) {
        return registrationRepository.findByUser_UserIdOrderByRegistrationTimeDesc(user.getUserId());
    }

    @Transactional
    public UserRegistration cancelRegistration(Long registrationId, User user) {
        UserRegistration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (reg.getUser() != null && !reg.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized to cancel this registration");
        }

        if (!"Submitted".equalsIgnoreCase(reg.getStatus())) {
            throw new RuntimeException("Only submitted registrations can be cancelled");
        }

        reg.setStatus("Cancelled");
        reg.setUpdatedAt(LocalDateTime.now());
        reg.setUpdatedBy(user);
        return registrationRepository.save(reg);
    }

    public Page<UserRegistration> searchRegistrations(Long subjectId, String status, LocalDateTime fromDate, LocalDateTime toDate, String search, Pageable pageable) {
        return registrationRepository.searchRegistrations(subjectId, status, fromDate, toDate, search, pageable);
    }

    public UserRegistration getRegistrationDetails(Long registrationId) {
        return registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
    }

    @Transactional
    public UserRegistration updateRegistration(Long registrationId, RegistrationUpdateRequest request, User salesUser) {
        UserRegistration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        String oldStatus = reg.getStatus();
        if (request.getStatus() != null) {
            reg.setStatus(request.getStatus());
        }
        if (request.getNotes() != null) {
            reg.setNotes(request.getNotes());
        }
        if (request.getValidFrom() != null) {
            reg.setValidFrom(request.getValidFrom());
        }
        if (request.getValidTo() != null) {
            reg.setValidTo(request.getValidTo());
        }
        reg.setUpdatedBy(salesUser);
        reg.setUpdatedAt(LocalDateTime.now());

        // Requirement: "On changing a registration status to Paid, if the user with relevant registered email does not exist,
        // the system would create one and send back to the user the login information (link, email, pass)"
        if ("Paid".equalsIgnoreCase(request.getStatus()) && !"Paid".equalsIgnoreCase(oldStatus)) {
            User targetUser = reg.getUser();
            if (targetUser == null) {
                targetUser = userRepository.findByEmail(reg.getEmail()).orElse(null);
            }

            if (targetUser == null) {
                Role customerRole = roleRepository.findByRoleName("CUSTOMER")
                        .orElseGet(() -> roleRepository.save(new Role("CUSTOMER", "System Customer")));

                targetUser = new User();
                targetUser.setEmail(reg.getEmail());
                targetUser.setFullName(reg.getFullName());
                targetUser.setMobile(reg.getMobile() != null ? reg.getMobile() : "0900000000");
                targetUser.setGender(reg.getGender() != null ? reg.getGender() : "Male");
                targetUser.setPasswordHash(passwordEncoder.encode("123456"));
                targetUser.setRole(customerRole);
                targetUser.setStatus("Active");
                targetUser.setCreatedAt(LocalDateTime.now());
                targetUser.setUpdatedAt(LocalDateTime.now());
                targetUser.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
                targetUser = userRepository.save(targetUser);
            }
            reg.setUser(targetUser);

            if (reg.getValidFrom() == null) {
                reg.setValidFrom(LocalDate.now());
            }
            if (reg.getValidTo() == null && reg.getPricePackage() != null) {
                reg.setValidTo(LocalDate.now().plusMonths(reg.getPricePackage().getAccessDurationMonths()));
            }

            // Create Payment record
            Payment payment = new Payment();
            payment.setRegistration(reg);
            payment.setAmount(reg.getTotalCost());
            payment.setMethod("Bank Transfer / Gateway");
            payment.setTransactionCode("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            payment.setStatus("Completed");
            payment.setPaidAt(LocalDateTime.now());
            payment.setCreatedBy(salesUser);
            paymentRepository.save(payment);
        }

        return registrationRepository.save(reg);
    }
}

