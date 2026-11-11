package com.quizpractice.repository;

import com.quizpractice.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
    List<UserAnswer> findBySession_SessionId(Long sessionId);
    Optional<UserAnswer> findBySession_SessionIdAndQuestion_QuestionId(Long sessionId, Long questionId);
}

