package com.quizpractice.repository;

import com.quizpractice.entity.QuizMatrixRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizMatrixRuleRepository extends JpaRepository<QuizMatrixRule, Long> {
    List<QuizMatrixRule> findByQuiz_QuizId(Long quizId);
    void deleteByQuiz_QuizId(Long quizId);
}

