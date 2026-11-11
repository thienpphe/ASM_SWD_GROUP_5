package com.quizpractice.repository;

import com.quizpractice.entity.SubjectDimension;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubjectDimensionRepository extends JpaRepository<SubjectDimension, Long> {
    List<SubjectDimension> findBySubject_SubjectId(Long subjectId);
    List<SubjectDimension> findBySubject_SubjectIdAndDimensionType_SettingId(Long subjectId, Long typeSettingId);
}

