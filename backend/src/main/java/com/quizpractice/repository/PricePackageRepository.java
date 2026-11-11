package com.quizpractice.repository;

import com.quizpractice.entity.PricePackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PricePackageRepository extends JpaRepository<PricePackage, Long> {
    List<PricePackage> findBySubject_SubjectId(Long subjectId);
    List<PricePackage> findBySubject_SubjectIdAndStatus(Long subjectId, String status);
    Optional<PricePackage> findTopBySubject_SubjectIdAndStatusOrderBySalePriceAsc(Long subjectId, String status);
}

