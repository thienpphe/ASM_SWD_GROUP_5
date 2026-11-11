package com.quizpractice.repository;

import com.quizpractice.entity.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findBySubject_SubjectId(Long subjectId);
    List<Quiz> findBySubject_SubjectIdAndTestType(Long subjectId, String testType);

    @Query("SELECT q FROM Quiz q WHERE (:subjectId IS NULL OR q.subject.subjectId = :subjectId) " +
           "AND (:testType IS NULL OR q.testType = :testType) " +
           "AND (:search IS NULL OR LOWER(q.quizName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Quiz> searchQuizzes(@Param("subjectId") Long subjectId,
                             @Param("testType") String testType,
                             @Param("search") String search,
                             Pageable pageable);
}

