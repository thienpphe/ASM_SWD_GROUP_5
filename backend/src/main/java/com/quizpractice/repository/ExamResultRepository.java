package com.quizpractice.repository;

import com.quizpractice.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    Optional<ExamResult> findBySession_SessionId(Long sessionId);
    List<ExamResult> findByUser_UserIdOrderBySubmittedAtDesc(Long userId);
}

