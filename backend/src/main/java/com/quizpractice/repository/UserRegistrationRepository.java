package com.quizpractice.repository;

import com.quizpractice.entity.UserRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserRegistrationRepository extends JpaRepository<UserRegistration, Long> {
    List<UserRegistration> findByUser_UserIdOrderByRegistrationTimeDesc(Long userId);
    List<UserRegistration> findByEmailOrderByRegistrationTimeDesc(String email);
    boolean existsByUser_UserIdAndSubject_SubjectIdAndStatus(Long userId, Long subjectId, String status);

    @Query("SELECT r FROM UserRegistration r WHERE (:subjectId IS NULL OR r.subject.subjectId = :subjectId) " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:fromDate IS NULL OR r.registrationTime >= :fromDate) " +
           "AND (:toDate IS NULL OR r.registrationTime <= :toDate) " +
           "AND (:search IS NULL OR LOWER(r.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.fullName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<UserRegistration> searchRegistrations(@Param("subjectId") Long subjectId,
                                              @Param("status") String status,
                                              @Param("fromDate") LocalDateTime fromDate,
                                              @Param("toDate") LocalDateTime toDate,
                                              @Param("search") String search,
                                              Pageable pageable);
}

