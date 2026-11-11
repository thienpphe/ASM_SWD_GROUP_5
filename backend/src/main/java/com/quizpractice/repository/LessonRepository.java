package com.quizpractice.repository;

import com.quizpractice.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findBySubject_SubjectIdOrderByDisplayOrderAsc(Long subjectId);
    List<Lesson> findBySubject_SubjectIdAndPricePackage_PackageIdOrderByDisplayOrderAsc(Long subjectId, Long packageId);
    List<Lesson> findBySubject_SubjectIdAndLessonType_Value(Long subjectId, String lessonTypeValue);
}

