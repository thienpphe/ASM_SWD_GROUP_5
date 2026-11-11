package com.quizpractice.repository;

import com.quizpractice.entity.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findBySubjectName(String subjectName);
    List<Subject> findByIsFeaturedTrueAndStatus(String status);
    List<Subject> findByStatus(String status);
    List<Subject> findByOwner_UserId(Long ownerId);

    @Query("SELECT s FROM Subject s WHERE (:status IS NULL OR s.status = :status) " +
           "AND (:categoryId IS NULL OR s.category.categoryId = :categoryId) " +
           "AND (:search IS NULL OR LOWER(s.subjectName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.tagLine) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Subject> searchSubjects(@Param("status") String status,
                                 @Param("categoryId") Long categoryId,
                                 @Param("search") String search,
                                 Pageable pageable);
}

