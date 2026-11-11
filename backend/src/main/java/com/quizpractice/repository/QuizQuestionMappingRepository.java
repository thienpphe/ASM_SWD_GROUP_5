package com.quizpractice.repository;

import com.quizpractice.entity.QuizQuestionMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizQuestionMappingRepository extends JpaRepository<QuizQuestionMapping, Long> {
    List<QuizQuestionMapping> findByQuiz_QuizIdOrderByOrderIndexAsc(Long quizId);
    void deleteByQuiz_QuizId(Long quizId);
}

