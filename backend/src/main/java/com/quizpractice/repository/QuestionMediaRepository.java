package com.quizpractice.repository;

import com.quizpractice.entity.QuestionMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionMediaRepository extends JpaRepository<QuestionMedia, Long> {
    List<QuestionMedia> findByQuestion_QuestionIdOrderByOrderIndexAsc(Long questionId);
}

