package com.quizpractice.repository;

import com.quizpractice.entity.TestSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TestSessionRepository extends JpaRepository<TestSession, Long> {
    List<TestSession> findByUser_UserIdOrderByStartedAtDesc(Long userId);
    List<TestSession> findByUser_UserIdAndPracticeIsNotNullOrderByStartedAtDesc(Long userId);
    List<TestSession> findByUser_UserIdAndExamIsNotNullOrderByStartedAtDesc(Long userId);
    Optional<TestSession> findBySessionIdAndUser_UserId(Long sessionId, Long userId);
}

