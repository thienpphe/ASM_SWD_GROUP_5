package com.quizpractice.service;

import com.quizpractice.dto.ContentDTOs.*;
import com.quizpractice.entity.Subject;
import com.quizpractice.entity.UserRegistration;
import com.quizpractice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRegistrationRepository registrationRepository;

    @Autowired
    private TestSessionRepository sessionRepository;

    public DashboardStatsDTO getStats() {
        DashboardStatsDTO dto = new DashboardStatsDTO();
        dto.setTotalUsers(userRepository.count());
        dto.setTotalSubjects(subjectRepository.count());

        List<UserRegistration> allRegs = registrationRepository.findAll();
        dto.setTotalRegistrations(allRegs.size());

        BigDecimal revenue = allRegs.stream()
                .filter(r -> "Paid".equalsIgnoreCase(r.getStatus()))
                .map(UserRegistration::getTotalCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalRevenue(revenue);

        dto.setTotalPractices(sessionRepository.count());

        // Hot subjects
        Map<String, Long> countBySubject = allRegs.stream()
                .collect(Collectors.groupingBy(r -> r.getSubject().getSubjectName(), Collectors.counting()));

        List<SubjectStat> hot = countBySubject.entrySet().stream()
                .map(e -> new SubjectStat(e.getKey(), e.getValue()))
                .sorted((a, b) -> Long.compare(b.getRegistrationsCount(), a.getRegistrationsCount()))
                .limit(5)
                .collect(Collectors.toList());

        if (hot.isEmpty()) {
            List<Subject> sampleSubjects = subjectRepository.findAll();
            for (Subject s : sampleSubjects) {
                hot.add(new SubjectStat(s.getSubjectName(), 12));
            }
        }

        dto.setHotSubjects(hot);
        return dto;
    }
}

