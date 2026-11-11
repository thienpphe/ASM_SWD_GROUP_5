package com.quizpractice.repository;

import com.quizpractice.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findBySubject_SubjectId(Long subjectId);
    List<Question> findByLesson_LessonId(Long lessonId);
    List<Question> findByDimension_DimensionId(Long dimensionId);

    @Query("SELECT q FROM Question q WHERE (:subjectId IS NULL OR q.subject.subjectId = :subjectId) " +
           "AND (:lessonId IS NULL OR q.lesson.lessonId = :lessonId) " +
           "AND (:dimensionId IS NULL OR q.dimension.dimensionId = :dimensionId) " +
           "AND (:level IS NULL OR q.level = :level) " +
           "AND (:status IS NULL OR q.status = :status) " +
           "AND (:search IS NULL OR LOWER(q.content) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Question> searchQuestions(@Param("subjectId") Long subjectId,
                                   @Param("lessonId") Long lessonId,
                                   @Param("dimensionId") Long dimensionId,
                                   @Param("level") String level,
                                   @Param("status") String status,
                                   @Param("search") String search,
                                   Pageable pageable);
}

