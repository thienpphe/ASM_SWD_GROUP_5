package com.quizpractice.repository;

import com.quizpractice.entity.PracticeTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PracticeTestRepository extends JpaRepository<PracticeTest, Long> {
    List<PracticeTest> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    List<PracticeTest> findByUser_UserIdAndSubject_SubjectIdOrderByCreatedAtDesc(Long userId, Long subjectId);
}

